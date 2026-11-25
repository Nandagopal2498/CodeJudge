import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'codejudge_dev_secret_fallback',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  rateLimit: {
    loginWindowMs: Number(process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // 15 mins
    loginMax: Number(process.env.LOGIN_RATE_LIMIT_MAX || 20),
    submitWindowMs: Number(process.env.SUBMIT_RATE_LIMIT_WINDOW_MS || 60 * 1000), // 1 min
    submitMax: Number(process.env.SUBMIT_RATE_LIMIT_MAX || 15),
  }
};
