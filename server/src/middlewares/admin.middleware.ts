import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware.js';

export function requireAdmin(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized: Authentication required' });
    return;
  }

  if (req.user.role !== 'Admin') {
    res.status(403).json({ message: 'Forbidden: Admin access required' });
    return;
  }

  next();
}
