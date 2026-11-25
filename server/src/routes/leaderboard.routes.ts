import { Router } from 'express';
import { getLeaderboard } from '../controllers/leaderboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const leaderboardRouter = Router();

// Protected leaderboard route
leaderboardRouter.get('/', requireAuth, getLeaderboard);
