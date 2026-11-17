import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { REQUIRED_DATABASE_NAME } from './constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isPlaceholderValue = (val = '') =>
  !val ||
  val.includes('<REPLACE') ||
  val.includes('<OPTIONAL') ||
  val.includes('<LAUNDRY_WALII');

export const assertStrongSecret = (secret, label) => {
  if (isPlaceholderValue(secret)) {
    throw new Error(
      `Security configuration error: ${label} must be set via environment variable and cannot be empty or a placeholder.`
    );
  }
  if (secret.length < 32) {
    throw new Error(
      `Security configuration error: ${label} must be at least 32 characters long.`
    );
  }
};

export const getEnvConfig = () => {
  const dbName = process.env.MONGODB_DB_NAME || REQUIRED_DATABASE_NAME;
  if (dbName !== REQUIRED_DATABASE_NAME) {
    throw new Error(
      `Database isolation error: MONGODB_DB_NAME must be strictly "${REQUIRED_DATABASE_NAME}". Received "${dbName}".`
    );
  }

  const corsOriginsRaw =
    process.env.CORS_ORIGINS ||
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:5175,http://127.0.0.1:5175,http://localhost:5177,http://127.0.0.1:5177';
  const corsOrigins = corsOriginsRaw
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || '';

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: Number(process.env.PORT) || 5001,
    mongoUri,
    mongodbUri: mongoUri,
    mongodbDbName: dbName,
    jwtSecret: process.env.JWT_SECRET || '',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    adminJwtSecret: process.env.ADMIN_JWT_SECRET || '',
    adminJwtExpiresIn: process.env.ADMIN_JWT_EXPIRES_IN || '12h',
    corsOrigins,
    rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 200,
    smtp: {
      host: (process.env.SMTP_HOST || '').trim(),
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
      user: (process.env.SMTP_USER || '').trim(),
      pass: process.env.SMTP_PASS || '',
      from: (process.env.SMTP_FROM || process.env.SMTP_USER || '').trim(),
      contactNotificationEmail: (
        process.env.CONTACT_NOTIFICATION_EMAIL || 'hr@connect2future.com'
      ).trim()
    },
    whatsapp: {
      provider: (process.env.WHATSAPP_PROVIDER || 'meta').trim().toLowerCase(),
      apiToken: (process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN || '').trim(),
      phoneNumberId: (process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim(),
      businessAccountId: (process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '').trim(),
      notifyNumber: (process.env.WHATSAPP_NOTIFY_NUMBER || '919035999272').replace(/\D/g, ''),
      twilioAccountSid: (process.env.TWILIO_ACCOUNT_SID || '').trim(),
      twilioAuthToken: (process.env.TWILIO_AUTH_TOKEN || '').trim(),
      twilioFromNumber: (process.env.TWILIO_WHATSAPP_FROM || '').trim(),
      webhookUrl: (process.env.WHATSAPP_WEBHOOK_URL || '').trim()
    },
    sms: {
      provider: (process.env.SMS_PROVIDER || 'none').trim().toLowerCase(),
      apiKey: (process.env.SMS_API_KEY || process.env.FAST2SMS_API_KEY || process.env.MSG91_AUTH_KEY || '').trim(),
      senderId: (process.env.SMS_SENDER_ID || '').trim(),
      notifyNumber: (process.env.SMS_NOTIFY_NUMBER || '919035999272').replace(/\D/g, '')
    },
    businessContact: {
      phone: (process.env.BUSINESS_PHONE || '9035999272').replace(/\D/g, ''),
      email: (process.env.BUSINESS_EMAIL || 'hr@connect2future.com').trim()
    }
  };
};

export const validateRuntimeEnv = () => {
  const cfg = getEnvConfig();

  if (isPlaceholderValue(cfg.mongoUri)) {
    throw new Error(
      'Missing or placeholder MONGO_URI. Set the Laundry Waliiii MongoDB Atlas connection string in server/.env.'
    );
  }

  assertStrongSecret(cfg.jwtSecret, 'JWT_SECRET');
  assertStrongSecret(cfg.adminJwtSecret, 'ADMIN_JWT_SECRET');

  if (cfg.jwtSecret === cfg.adminJwtSecret) {
    throw new Error(
      'Security configuration error: ADMIN_JWT_SECRET must be distinct from customer JWT_SECRET.'
    );
  }

  return cfg;
};

