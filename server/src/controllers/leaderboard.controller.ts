import { Request, Response } from 'express';
import { LeaderboardModel } from '../models/Leaderboard.js';

export function getLeaderboard(req: Request, res: Response): void {
  try {
    const leaderboard = LeaderboardModel.getLeaderboard();
    res.json({ leaderboard });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Internal server error fetching leaderboard' });
  }
}
