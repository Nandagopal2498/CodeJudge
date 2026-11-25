import { db } from '../config/db.js';
import { PROBLEM_TAGS } from '../seedData/problemTags.js';
import { STARTER_CODES } from '../seedData/starterCodes.js';

export interface TestCase {
  id?: number;
  problem_id: number;
  input: string;
  expected_output: string;
  is_sample: number; // 1 or 0
  created_at?: string;
}

export interface Problem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  time_limit: number;
  memory_limit: number;
  points: number;
  starter_code?: string;
  created_at: string;
  tags?: string[];
  is_solved?: boolean;
}

export interface ProblemDetail extends Problem {
  starter_code: string;
  sample_cases: Array<{
    input: string;
    expected_output: string;
  }>;
  prev_problem?: { id: number; title: string; slug: string } | null;
  next_problem?: { id: number; title: string; slug: string } | null;
}

export class ProblemModel {
  static findAll(userId?: number): Array<Pick<Problem, 'id' | 'title' | 'slug' | 'difficulty' | 'time_limit' | 'memory_limit' | 'points' | 'created_at' | 'tags' | 'is_solved'>> {
    const stmt = db.prepare(`
      SELECT id, title, slug, difficulty, time_limit, memory_limit, points, created_at
      FROM problems
      ORDER BY id ASC
    `);
    const problems = stmt.all() as Array<Pick<Problem, 'id' | 'title' | 'slug' | 'difficulty' | 'time_limit' | 'memory_limit' | 'points' | 'created_at'>>;

    let solvedSet = new Set<number>();
    if (userId) {
      const solvedStmt = db.prepare(`
        SELECT DISTINCT problem_id
        FROM submissions
        WHERE user_id = ? AND verdict = 'Accepted'
      `);
      const rows = solvedStmt.all(userId) as Array<{ problem_id: number }>;
      solvedSet = new Set(rows.map(r => r.problem_id));
    }

    return problems.map((p) => ({
      ...p,
      tags: PROBLEM_TAGS[p.slug] || [],
      is_solved: solvedSet.has(p.id)
    }));
  }

  static findBySlug(slug: string, userId?: number): ProblemDetail | undefined {
    const isId = /^\d+$/.test(slug);
    const stmt = isId
      ? db.prepare('SELECT * FROM problems WHERE id = ?')
      : db.prepare('SELECT * FROM problems WHERE slug = ?');
    const problem = (isId ? stmt.get(Number(slug)) : stmt.get(slug)) as Problem | undefined;
    if (!problem) return undefined;

    let isSolved = false;
    if (userId) {
      const solvedStmt = db.prepare(`
        SELECT 1
        FROM submissions
        WHERE user_id = ? AND problem_id = ? AND verdict = 'Accepted'
        LIMIT 1
      `);
      isSolved = !!solvedStmt.get(userId, problem.id);
    }

    const sampleStmt = db.prepare(`
      SELECT input, expected_output
      FROM test_cases
      WHERE problem_id = ? AND is_sample = 1
      ORDER BY id ASC
    `);
    const sampleCases = sampleStmt.all(problem.id) as Array<{
      input: string;
      expected_output: string;
    }>;

    // Previous problem
    const prevStmt = db.prepare(`
      SELECT id, title, slug
      FROM problems
      WHERE id < ?
      ORDER BY id DESC
      LIMIT 1
    `);
    const prevProblem = prevStmt.get(problem.id) as { id: number; title: string; slug: string } | undefined;

    // Next problem
    const nextStmt = db.prepare(`
      SELECT id, title, slug
      FROM problems
      WHERE id > ?
      ORDER BY id ASC
      LIMIT 1
    `);
    const nextProblem = nextStmt.get(problem.id) as { id: number; title: string; slug: string } | undefined;

    return {
      ...problem,
      tags: PROBLEM_TAGS[problem.slug] || [],
      is_solved: isSolved,
      starter_code: problem.starter_code || STARTER_CODES[problem.slug] || `#include <iostream>\n#include <vector>\n#include <unordered_map>\n\nusing namespace std;\n\nint main() {\n    \n\n    return 0;\n}\n`,
      sample_cases: sampleCases,
      prev_problem: prevProblem || null,
      next_problem: nextProblem || null
    };
  }

  static count(): number {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM problems');
    const result = stmt.get() as { count: number };
    return result.count;
  }
}
