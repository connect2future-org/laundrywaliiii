import { validateRuntimeEnv } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { createApp } from './app.js';

const startServer = async () => {
  try {
    const cfg = validateRuntimeEnv();
    await connectDatabase();

    const app = createApp();
    const server = app.listen(cfg.port, () => {
      console.log(
        `[laundrywalii-api] Running in ${cfg.nodeEnv} mode on port ${cfg.port} (DB: ${cfg.mongodbDbName})`
      );
    });

    const shutdown = async (signal) => {
      console.log(`\n[laundrywalii-api] ${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    console.error('[laundrywalii-api] Startup aborted:', err.message);
    process.exit(1);
  }
};

startServer();

