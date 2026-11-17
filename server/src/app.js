import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { getEnvConfig } from './config/env.js';
import { apiRateLimiter } from './middleware/rateLimitMiddleware.js';
import { notFoundHandler, errorHandler, AppError } from './middleware/errorMiddleware.js';
import apiRouter from './routes/index.js';

const LOCAL_DEV_ORIGIN_REGEX = /^http:\/\/(localhost|127\.0\.0\.1):\d{2,5}$/;

export const isOriginAllowed = (origin, cfg) => {
  if (!origin) return true;
  if (cfg.corsOrigins.includes(origin)) return true;
  if (cfg.nodeEnv === 'development' && LOCAL_DEV_ORIGIN_REGEX.test(origin)) {
    return true;
  }
  return false;
};

export const createApp = () => {
  const cfg = getEnvConfig();
  const app = express();

  // Security headers
  app.use(helmet());

  // Controlled CORS allowlist (applied before routes and preflight OPTIONS)
  const corsOptions = {
    origin: (origin, callback) => {
      if (isOriginAllowed(origin, cfg)) {
        callback(null, true);
      } else {
        callback(new AppError(`Origin ${origin} not allowed by Laundry Waliiii CORS policy`, 403));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));

  if (cfg.nodeEnv === 'development') {
    app.use(morgan('dev'));
  }

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  app.use('/api', apiRateLimiter);
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

export default createApp;

