import { db } from '../config/db.js';
import { SeedProblem } from '../seed.types.js';

export function saveProblemsToDb(problems: SeedProblem[]): { inserted: number; skipped: number } {
  const insertProblem = db.prepare(`
    INSERT INTO problems (title, slug, difficulty, description, input_format, output_format, constraints, time_limit, memory_limit, points)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertTestCase = db.prepare(`
    INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
    VALUES (?, ?, ?, ?)
  `);

  const findProblemBySlug = db.prepare('SELECT id FROM problems WHERE slug = ?');

  let inserted = 0;
  let skipped = 0;

  const transaction = db.transaction(() => {
    for (const p of problems) {
      const existing = findProblemBySlug.get(p.slug) as { id: number } | undefined;
      if (existing) {
        skipped++;
        continue;
      }

      const info = insertProblem.run(
        p.title,
        p.slug,
        p.difficulty,
        p.description,
        p.input_format,
        p.output_format,
        p.constraints,
        p.time_limit,
        p.memory_limit,
        p.points
      );
      const problemId = Number(info.lastInsertRowid);

      for (const sample of p.samples) {
        insertTestCase.run(problemId, sample.input, sample.output, 1);
      }
      for (const hidden of p.hidden) {
        insertTestCase.run(problemId, hidden.input, hidden.output, 0);
      }
      inserted++;
    }
  });

  transaction();
  return { inserted, skipped };
}

export function getDbCounts(): { total: number; easy: number; medium: number; hard: number } {
  const total = (db.prepare('SELECT COUNT(*) as count FROM problems').get() as { count: number }).count;
  const easy = (db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Easy'").get() as { count: number }).count;
  const medium = (db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Medium'").get() as { count: number }).count;
  const hard = (db.prepare("SELECT COUNT(*) as count FROM problems WHERE difficulty = 'Hard'").get() as { count: number }).count;
  return { total, easy, medium, hard };
}
