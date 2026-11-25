import { Router } from 'express';
import { submitSolution, runSampleTests, getUserSubmissions } from '../controllers/submission.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { submitLimiter } from '../middlewares/rateLimit.middleware.js';

export const submissionRouter = Router();

submissionRouter.post('/', requireAuth, submitLimiter, submitSolution);
submissionRouter.post('/run', requireAuth, submitLimiter, runSampleTests);
submissionRouter.get('/', requireAuth, getUserSubmissions);
