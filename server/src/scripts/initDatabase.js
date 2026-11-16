import { getEnvConfig } from '../config/env.js';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { initializeCollectionsAndIndexes } from '../services/dbInitService.js';

/**
 * Safe Database Initialization Script for LaundryWalii
 * ----------------------------------------------------
 * - Connects strictly to the isolated "LaundryWalii" database
 * - Creates missing collections safely (never drops existing databases or collections)
 * - Syncs all Mongoose schema indexes cleanly
 * - Never inserts fake business data or dummy customers
 */
const runDatabaseInitialization = async () => {
  try {
    const cfg = getEnvConfig();
    if (!cfg.mongoUri || cfg.mongoUri.includes('<LAUNDRY_WALII')) {
      throw new Error(
        'MONGO_URI is not configured in server/.env. Cannot connect to MongoDB Atlas.'
      );
    }

    console.log(`[db:init] Connecting strictly to database "${cfg.mongodbDbName}"...`);
    await connectDatabase();

    const summary = await initializeCollectionsAndIndexes();
    console.log('[db:init] Collections and indexes initialized cleanly:');
    console.table(summary);
  } catch (err) {
    console.error('[db:init] Initialization failed:', err.message);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
};

runDatabaseInitialization();

