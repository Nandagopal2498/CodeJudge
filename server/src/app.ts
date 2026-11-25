import express, { Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { authRouter } from './routes/auth.routes.js';
import { problemRouter } from './routes/problem.routes.js';
import { submissionRouter } from './routes/submission.routes.js';
import { leaderboardRouter } from './routes/leaderboard.routes.js';
import { adminRouter } from './routes/admin.routes.js';
import { requireAuth, AuthRequest } from './middlewares/auth.middleware.js';
import { seedProblemsIfEmpty } from './seed.js';

dotenv.config();

// Ensure default problems are seeded on server start
seedProblemsIfEmpty();

export const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Static client build assets
const clientDistCandidates = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist')
];
const clientDistPath = clientDistCandidates.find((p) => fs.existsSync(p)) || path.resolve(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/problems', problemRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/admin', adminRouter);

// Public health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Code Judge API Server is online',
    timestamp: new Date().toISOString()
  });
});

// Protected profile endpoint
app.get('/api/protected/profile', requireAuth, (req: AuthRequest, res: Response) => {
  res.json({
    message: 'You have accessed a protected route successfully',
    user: req.user
  });
});

// Catch-all route to serve client/dist/index.html for any non-API request (SPA routing)
app.get('*', (req: Request, res: Response) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not Found');
  }
});

