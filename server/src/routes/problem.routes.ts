import { Router } from 'express';
import { getAllProblems, getProblemBySlug } from '../controllers/problem.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

export const problemRouter = Router();

// Protected problem routes as per user requirement
problemRouter.get('/', requireAuth, getAllProblems);
problemRouter.get('/:slug', requireAuth, getProblemBySlug);
