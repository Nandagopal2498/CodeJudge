import { db } from '../config/db.js';

export interface LeaderboardEntry {
  rank: number;
  userId: number;
  username: string;
  problemsSolved: number;
  totalPoints: number;
}

export class LeaderboardModel {
  static getLeaderboard(): LeaderboardEntry[] {
    const query = `
      WITH FirstAccepted AS (
        SELECT 
          s.user_id,
          s.problem_id,
          MIN(s.id) as first_sub_id,
          MIN(s.created_at) as solved_at
        FROM submissions s
        WHERE s.verdict = 'Accepted'
        GROUP BY s.user_id, s.problem_id
      )
      SELECT 
        u.id as user_id,
        u.username,
        COUNT(fa.problem_id) as problems_solved,
        COALESCE(SUM(p.points), 0) as total_points
      FROM users u
      LEFT JOIN FirstAccepted fa ON u.id = fa.user_id
      LEFT JOIN problems p ON fa.problem_id = p.id
      GROUP BY u.id, u.username
      ORDER BY total_points DESC, problems_solved DESC, u.id ASC
    `;

    const rows = db.prepare(query).all() as Array<{
      user_id: number;
      username: string;
      problems_solved: number;
      total_points: number;
    }>;

    return rows.map((row, index) => ({
      rank: index + 1,
      userId: row.user_id,
      username: row.username,
      problemsSolved: Number(row.problems_solved || 0),
      totalPoints: Number(row.total_points || 0)
    }));
  }
}
