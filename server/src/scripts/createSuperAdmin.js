import readline from 'node:readline';
import { getEnvConfig } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { AdminUser } from '../models/index.js';
import { hashPassword } from '../services/passwordService.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[6-9]\d{9}$/;

const promptVisible = (rl, question) =>
  new Promise((resolve) => {
    rl.question(question, (answer) => resolve(answer.trim()));
  });

const promptMaskedPassword = (question) =>
  new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    const wasRaw = Boolean(stdin.isRaw);
    if (stdin.isTTY) {
      stdin.setRawMode(true);
    }
    stdin.resume();
    stdin.setEncoding('utf8');

    let password = '';
    const onData = (ch) => {
      if (ch === '\n' || ch === '\r' || ch === '\u0004') {
        if (stdin.isTTY) stdin.setRawMode(wasRaw);
        stdin.pause();
        stdin.removeListener('data', onData);
        process.stdout.write('\n');
        resolve(password);
      } else if (ch === '\u0003') {
        if (stdin.isTTY) stdin.setRawMode(wasRaw);
        process.stdout.write('\n');
        process.exit(1);
      } else if (ch === '\u007f' || ch === '\b') {
        if (password.length > 0) {
          password = password.slice(0, -1);
          process.stdout.write('\b \b');
        }
      } else {
        password += ch;
        process.stdout.write('*');
      }
    };
    stdin.on('data', onData);
  });

const validateInputs = ({ fullName, email, phone, password }) => {
  if (!fullName || fullName.length < 2) {
    throw new Error('Full name must be at least 2 characters.');
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    throw new Error('A valid email address is required.');
  }
  if (!phone || !PHONE_REGEX.test(phone)) {
    throw new Error('A valid 10-digit Indian mobile number starting with 6-9 is required.');
  }
  if (
    !password ||
    password.length < 10 ||
    !/[A-Z]/.test(password) ||
    !/[a-z]/.test(password) ||
    !/\d/.test(password)
  ) {
    throw new Error(
      'Password must be at least 10 characters long and include uppercase, lowercase, and a number.'
    );
  }
};

const runBootstrap = async () => {
  let rl = null;
  try {
    const cfg = getEnvConfig();
    if (!cfg.mongoUri || cfg.mongoUri.includes('<LAUNDRY_WALII')) {
      throw new Error('MONGO_URI is not configured in server/.env');
    }

    await connectDatabase();

    const existingSuperAdmins = await AdminUser.countDocuments({ role: 'super_admin' });
    if (existingSuperAdmins > 0) {
      throw new Error(
        'A super_admin account already exists. Bootstrap is locked; use an authenticated super_admin session via POST /api/v1/admin/users to create additional admins.'
      );
    }

    let fullName = process.env.BOOTSTRAP_ADMIN_NAME?.trim() || '';
    let email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim() || '';
    let phone = process.env.BOOTSTRAP_ADMIN_PHONE?.trim() || '';
    let password = process.env.BOOTSTRAP_ADMIN_PASSWORD || '';

    if (!fullName || !email || !phone || !password) {
      if (!process.stdin.isTTY) {
        throw new Error(
          'Interactive TTY not detected. Provide BOOTSTRAP_ADMIN_NAME, BOOTSTRAP_ADMIN_EMAIL, BOOTSTRAP_ADMIN_PHONE, and BOOTSTRAP_ADMIN_PASSWORD via environment variables or run in an interactive terminal.'
        );
      }

      rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      console.log('\n[admin:bootstrap] Creating initial LaundryWalii Super Admin (no defaults used).');
      if (!fullName) fullName = await promptVisible(rl, 'Full Name: ');
      if (!email) email = await promptVisible(rl, 'Admin Email: ');
      if (!phone) phone = await promptVisible(rl, '10-digit Mobile: ');
      rl.close();
      rl = null;
      if (!password) {
        password = await promptMaskedPassword(
          'Strong Password (min 10 chars, upper+lower+digit): '
        );
      }
    }

    validateInputs({ fullName, email, phone, password });

    const duplicate = await AdminUser.findOne({
      $or: [{ email: email.toLowerCase() }, { phone }]
    });
    if (duplicate) {
      throw new Error('An admin account with this email or phone already exists.');
    }

    const passwordHash = await hashPassword(password);
    const created = await AdminUser.create({
      fullName,
      email: email.toLowerCase(),
      phone,
      passwordHash,
      role: 'super_admin',
      isActive: true
    });

    console.log(
      `[admin:bootstrap] Initial super_admin created successfully (id: ${created._id}, email: ${created.email}).`
    );
  } catch (err) {
    console.error('[admin:bootstrap] Aborted:', err.message);
    process.exitCode = 1;
  } finally {
    if (rl) rl.close();
    await disconnectDatabase();
  }
};

runBootstrap();

