import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { getEnvConfig, assertStrongSecret, validateRuntimeEnv } from '../src/config/env.js';
import { signCustomerToken, verifyCustomerToken, signAdminToken, verifyAdminToken } from '../src/services/tokenService.js';
import { hashPassword, verifyPassword } from '../src/services/passwordService.js';

const withTempEnv = (overrides, fn) => {
  const backup = {};
  for (const key of Object.keys(overrides)) {
    backup[key] = process.env[key];
    if (overrides[key] === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = overrides[key];
    }
  }
  try {
    return fn();
  } finally {
    for (const key of Object.keys(overrides)) {
      if (backup[key] === undefined) delete process.env[key];
      else process.env[key] = backup[key];
    }
  }
};

test('getEnvConfig enforces strict database isolation to LaundryWalii', () => {
  withTempEnv({ MONGODB_DB_NAME: 'mrwashwala' }, () => {
    assert.throws(() => getEnvConfig(), /must be strictly "LaundryWalii"/);
  });

  withTempEnv({ MONGODB_DB_NAME: 'LaundryWalii' }, () => {
    const cfg = getEnvConfig();
    assert.equal(cfg.mongodbDbName, 'LaundryWalii');
  });
});

test('assertStrongSecret rejects placeholders and weak secrets', () => {
  assert.throws(() => assertStrongSecret('', 'JWT_SECRET'), /cannot be empty or a placeholder/);
  assert.throws(() => assertStrongSecret('<REPLACE_WITH_MIN_32_CHAR_RANDOM_SECRET>', 'JWT_SECRET'), /placeholder/);
  assert.throws(() => assertStrongSecret('short-secret', 'JWT_SECRET'), /at least 32 characters/);

  const strong = crypto.randomBytes(32).toString('hex');
  assert.doesNotThrow(() => assertStrongSecret(strong, 'JWT_SECRET'));
});

test('validateRuntimeEnv rejects identical customer and admin secrets', () => {
  const shared = crypto.randomBytes(32).toString('hex');
  withTempEnv(
    {
      MONGO_URI: 'mongodb+srv://user:pass@cluster.mongodb.net/LaundryWalii',
      MONGODB_DB_NAME: 'LaundryWalii',
      JWT_SECRET: shared,
      ADMIN_JWT_SECRET: shared
    },
    () => {
      assert.throws(() => validateRuntimeEnv(), /must be distinct/);
    }
  );
});

test('JWT signing and verification keeps customer and admin tokens isolated', () => {
  const custSecret = crypto.randomBytes(32).toString('hex');
  const adminSecret = crypto.randomBytes(32).toString('hex');

  withTempEnv({ JWT_SECRET: custSecret, ADMIN_JWT_SECRET: adminSecret }, () => {
    const customerToken = signCustomerToken({ _id: '6731a1b2c3d4e5f6a7b8c9d0', phone: '9035999272' });
    const adminToken = signAdminToken({ _id: '6731a1b2c3d4e5f6a7b8c9d1', role: 'super_admin' });

    const decodedCust = verifyCustomerToken(customerToken);
    assert.equal(decodedCust.type, 'customer');

    const decodedAdmin = verifyAdminToken(adminToken);
    assert.equal(decodedAdmin.role, 'super_admin');

    assert.throws(() => verifyAdminToken(customerToken));
    assert.throws(() => verifyCustomerToken(adminToken));
  });
});

test('passwordService hashes and verifies passwords with bcrypt', async () => {
  const raw = 'StrongPass!2026';
  const hash = await hashPassword(raw);
  assert.notEqual(hash, raw);
  assert.equal(await verifyPassword(raw, hash), true);
  assert.equal(await verifyPassword('WrongPassword', hash), false);
});

