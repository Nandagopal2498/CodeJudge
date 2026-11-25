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
      ),
      UserStats AS (
        SELECT 
          u.id as user_id,
          u.username,
          COUNT(fa.problem_id) as problems_solved,
          COALESCE(SUM(p.points), 0) as total_points,
          MAX(fa.solved_at) as latest_solve_at
        FROM users u
        INNER JOIN FirstAccepted fa ON u.id = fa.user_id
        INNER JOIN problems p ON fa.problem_id = p.id
        GROUP BY u.id, u.username
        HAVING problems_solved > 0
      )
      SELECT 
        user_id,
        username,
        problems_solved,
        total_points,
        latest_solve_at
      FROM UserStats
      ORDER BY total_points DESC, problems_solved DESC, latest_solve_at ASC, user_id ASC
    `;

    const rows = db.prepare(query).all() as Array<{
      user_id: number;
      username: string;
      problems_solved: number;
      total_points: number;
      latest_solve_at: string;
    }>;

    let currentRank = 1;
    return rows.map((row, index) => {
      if (index > 0) {
        const prev = rows[index - 1];
        // If points and solve time are different, update rank
        if (row.total_points !== prev.total_points || row.latest_solve_at !== prev.latest_solve_at) {
          currentRank = index + 1;
        }
      }
      return {
        rank: currentRank,
        userId: row.user_id,
        username: row.username,
        problemsSolved: Number(row.problems_solved || 0),
        totalPoints: Number(row.total_points || 0)
      };
    });
  }
}
