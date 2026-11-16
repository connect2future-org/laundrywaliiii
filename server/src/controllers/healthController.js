import { getDatabaseHealth } from '../config/database.js';
import { REQUIRED_DATABASE_NAME } from '../config/constants.js';

export const getHealth = (_req, res) => {
  const db = getDatabaseHealth();
  res.json({
    success: true,
    service: 'laundrywalii-api',
    databaseTarget: REQUIRED_DATABASE_NAME,
    database: db,
    timestamp: new Date().toISOString()
  });
};

