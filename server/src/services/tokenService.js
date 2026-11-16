import jwt from 'jsonwebtoken';
import { getEnvConfig, assertStrongSecret } from '../config/env.js';

export const signCustomerToken = (customer) => {
  const cfg = getEnvConfig();
  assertStrongSecret(cfg.jwtSecret, 'JWT_SECRET');

  return jwt.sign(
    {
      sub: String(customer._id),
      type: 'customer',
      phone: customer.phone
    },
    cfg.jwtSecret,
    { expiresIn: cfg.jwtExpiresIn }
  );
};

export const verifyCustomerToken = (token) => {
  const cfg = getEnvConfig();
  assertStrongSecret(cfg.jwtSecret, 'JWT_SECRET');

  const decoded = jwt.verify(token, cfg.jwtSecret);
  if (decoded.type !== 'customer') {
    throw new Error('Invalid customer token type');
  }
  return decoded;
};

export const signAdminToken = (adminUser) => {
  const cfg = getEnvConfig();
  assertStrongSecret(cfg.adminJwtSecret, 'ADMIN_JWT_SECRET');

  return jwt.sign(
    {
      sub: String(adminUser._id),
      type: 'admin',
      role: adminUser.role,
      branchId: adminUser.assignedBranchId ? String(adminUser.assignedBranchId) : null
    },
    cfg.adminJwtSecret,
    { expiresIn: cfg.adminJwtExpiresIn }
  );
};

export const verifyAdminToken = (token) => {
  const cfg = getEnvConfig();
  assertStrongSecret(cfg.adminJwtSecret, 'ADMIN_JWT_SECRET');

  const decoded = jwt.verify(token, cfg.adminJwtSecret);
  if (decoded.type !== 'admin') {
    throw new Error('Invalid admin token type');
  }
  return decoded;
};

