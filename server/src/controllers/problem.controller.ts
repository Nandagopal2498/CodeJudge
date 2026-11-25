import { Request, Response } from 'express';
import { ProblemModel } from '../models/Problem.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

export function getAllProblems(req: Request, res: Response): void {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const problems = ProblemModel.findAll(userId);
    res.json({ problems });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Internal server error fetching problems' });
  }
}

export function getProblemBySlug(req: Request, res: Response): void {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.userId;
    const { slug } = req.params;
    const problem = ProblemModel.findBySlug(slug, userId);

    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }

    res.json({ problem });
  } catch (error) {
    console.error('Error fetching problem details:', error);
    res.status(500).json({ message: 'Internal server error fetching problem' });
  }
}
