import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/auth.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { loginLimiter } from '../middlewares/rateLimit.middleware.js';

export const authRouter = Router();

authRouter.post('/register', loginLimiter, register);
authRouter.post('/login', loginLimiter, login);
authRouter.post('/logout', logout);
authRouter.get('/me', requireAuth, getMe);
