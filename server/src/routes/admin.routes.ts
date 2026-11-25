import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireAdmin } from '../middlewares/admin.middleware.js';
import {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemTestCases,
  addTestCase,
  updateTestCase,
  deleteTestCase
} from '../controllers/admin.controller.js';

export const adminRouter = Router();

// Protect all admin routes
adminRouter.use(requireAuth, requireAdmin);

// Problem management
adminRouter.post('/problems', createProblem);
adminRouter.put('/problems/:id', updateProblem);
adminRouter.delete('/problems/:id', deleteProblem);

// Test case management
adminRouter.get('/problems/:problemId/test-cases', getProblemTestCases);
adminRouter.post('/problems/:problemId/test-cases', addTestCase);
adminRouter.put('/test-cases/:id', updateTestCase);
adminRouter.delete('/test-cases/:id', deleteTestCase);
