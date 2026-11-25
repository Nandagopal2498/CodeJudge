import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

export const loginLimiter = rateLimit({
  windowMs: config.rateLimit.loginWindowMs,
  max: config.rateLimit.loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts from this IP, please try again later.' }
});

// Enforce 10 submissions per minute per user / IP
export const submitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 10, // 10 submissions per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Submission rate limit exceeded. Please wait a moment before submitting again (max 10 submissions per minute).' }
});
