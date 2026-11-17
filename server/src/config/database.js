import mongoose from 'mongoose';
import { getEnvConfig } from './env.js';
import { REQUIRED_DATABASE_NAME } from './constants.js';

mongoose.set('strictQuery', true);

export const connectDatabase = async (overrideUri) => {
  const cfg = getEnvConfig();
  const uri = overrideUri || cfg.mongoUri;

  if (!uri || uri.includes('<LAUNDRY_WALII')) {
    throw new Error(
      'MONGO_URI is not configured. Set the dedicated Laundry Waliiii Atlas URI in server/.env.'
    );
  }

  if (cfg.mongodbDbName !== REQUIRED_DATABASE_NAME) {
    throw new Error(
      `Refusing connection to unexpected database "${cfg.mongodbDbName}". Only "${REQUIRED_DATABASE_NAME}" is permitted.`
    );
  }

  await mongoose.connect(uri, {
    dbName: REQUIRED_DATABASE_NAME,
    autoIndex: cfg.nodeEnv !== 'production',
    serverSelectionTimeoutMS: 10000
  });

  const activeDbName = mongoose.connection.name;
  if (activeDbName !== REQUIRED_DATABASE_NAME) {
    await mongoose.disconnect();
    throw new Error(
      `Connected DB mismatch ("${activeDbName}"). Disconnected to enforce strict isolation on "${REQUIRED_DATABASE_NAME}".`
    );
  }

  return mongoose.connection;
};

export const disconnectDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};

export const getDatabaseHealth = () => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    state: stateMap[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    dbName: mongoose.connection.readyState === 1 ? mongoose.connection.name : REQUIRED_DATABASE_NAME
  };
};

