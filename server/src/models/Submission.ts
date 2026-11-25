import { db } from '../config/db.js';

export interface Submission {
  id: number;
  user_id: number;
  problem_id: number;
  code: string;
  language?: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error' | 'Pending';
  runtime_ms: number;
  created_at: string;
}

export interface SubmissionWithProblem extends Submission {
  problem_title: string;
  problem_slug: string;
  difficulty: string;
  total_tests?: number;
}

export class SubmissionModel {
  static create(
    userId: number,
    problemId: number,
    code: string,
    verdict: string,
    runtimeMs: number = 0,
    language: string = 'C++20'
  ): Submission {
    const stmt = db.prepare(`
      INSERT INTO submissions (user_id, problem_id, code, language, verdict, runtime_ms)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(userId, problemId, code, language, verdict, runtimeMs);
    return {
      id: Number(info.lastInsertRowid),
      user_id: userId,
      problem_id: problemId,
      code,
      language,
      verdict: verdict as Submission['verdict'],
      runtime_ms: runtimeMs,
      created_at: new Date().toISOString()
    };
  }

  static findByUserId(userId: number): SubmissionWithProblem[] {
    const stmt = db.prepare(`
      SELECT 
        s.id,
        s.user_id,
        s.problem_id,
        s.code,
        s.language,
        s.verdict,
        s.runtime_ms,
        s.created_at,
        p.title AS problem_title,
        p.slug AS problem_slug,
        p.difficulty,
        (SELECT COUNT(*) FROM test_cases tc WHERE tc.problem_id = s.problem_id) AS total_tests
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ?
      ORDER BY s.id DESC
    `);
    return stmt.all(userId) as SubmissionWithProblem[];
  }

  static findById(id: number): SubmissionWithProblem | undefined {
    const stmt = db.prepare(`
      SELECT 
        s.id,
        s.user_id,
        s.problem_id,
        s.code,
        s.language,
        s.verdict,
        s.runtime_ms,
        s.created_at,
        p.title AS problem_title,
        p.slug AS problem_slug,
        p.difficulty,
        (SELECT COUNT(*) FROM test_cases tc WHERE tc.problem_id = s.problem_id) AS total_tests
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.id = ?
    `);
    return stmt.get(id) as SubmissionWithProblem | undefined;
  }
}
