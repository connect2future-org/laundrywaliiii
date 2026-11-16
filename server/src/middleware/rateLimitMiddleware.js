import rateLimit from 'express-rate-limit';
import { getEnvConfig } from '../config/env.js';

const cfg = getEnvConfig();

export const apiRateLimiter = rateLimit({
  windowMs: cfg.rateLimitWindowMs,
  max: cfg.rateLimitMaxRequests,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again later.'
  }
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please wait 15 minutes and retry.'
  }
});

export const publicSubmissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Submission limit reached. Please try again shortly.'
  }
});

