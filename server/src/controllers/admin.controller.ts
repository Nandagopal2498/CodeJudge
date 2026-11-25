import { Request, Response } from 'express';
import { db } from '../config/db.js';

interface ProblemInput {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  time_limit?: number;
  memory_limit?: number;
  points?: number;
}

export function createProblem(req: Request, res: Response): void {
  try {
    const {
      title,
      slug,
      difficulty,
      description,
      input_format,
      output_format,
      constraints,
      time_limit = 1000,
      memory_limit = 256,
      points = 100
    }: ProblemInput = req.body;

    if (!title || !slug || !difficulty || !description || !input_format || !output_format || !constraints) {
      res.status(400).json({ message: 'All problem fields are required' });
      return;
    }

    const existing = db.prepare('SELECT id FROM problems WHERE slug = ?').get(slug);
    if (existing) {
      res.status(409).json({ message: 'A problem with this slug already exists' });
      return;
    }

    const stmt = db.prepare(`
      INSERT INTO problems (title, slug, difficulty, description, input_format, output_format, constraints, time_limit, memory_limit, points)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const info = stmt.run(
      title,
      slug.toLowerCase().trim(),
      difficulty,
      description,
      input_format,
      output_format,
      constraints,
      Number(time_limit),
      Number(memory_limit),
      Number(points)
    );

    res.status(201).json({
      message: 'Problem created successfully',
      problemId: Number(info.lastInsertRowid)
    });
  } catch (error) {
    console.error('Error creating problem:', error);
    res.status(500).json({ message: 'Internal server error creating problem' });
  }
}

export function updateProblem(req: Request, res: Response): void {
  try {
    const id = Number(req.params.id);
    const {
      title,
      slug,
      difficulty,
      description,
      input_format,
      output_format,
      constraints,
      time_limit,
      memory_limit,
      points
    } = req.body;

    const existing = db.prepare('SELECT id FROM problems WHERE id = ?').get(id);
    if (!existing) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }

    if (slug) {
      const slugCheck = db.prepare('SELECT id FROM problems WHERE slug = ? AND id != ?').get(slug, id);
      if (slugCheck) {
        res.status(409).json({ message: 'Slug already taken by another problem' });
        return;
      }
    }

    const stmt = db.prepare(`
      UPDATE problems
      SET 
        title = COALESCE(?, title),
        slug = COALESCE(?, slug),
        difficulty = COALESCE(?, difficulty),
        description = COALESCE(?, description),
        input_format = COALESCE(?, input_format),
        output_format = COALESCE(?, output_format),
        constraints = COALESCE(?, constraints),
        time_limit = COALESCE(?, time_limit),
        memory_limit = COALESCE(?, memory_limit),
        points = COALESCE(?, points)
      WHERE id = ?
    `);

    stmt.run(
      title || null,
      slug ? slug.toLowerCase().trim() : null,
      difficulty || null,
      description || null,
      input_format || null,
      output_format || null,
      constraints || null,
      time_limit ? Number(time_limit) : null,
      memory_limit ? Number(memory_limit) : null,
      points ? Number(points) : null,
      id
    );

    res.json({ message: 'Problem updated successfully' });
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ message: 'Internal server error updating problem' });
  }
}

export function deleteProblem(req: Request, res: Response): void {
  try {
    const id = Number(req.params.id);
    const info = db.prepare('DELETE FROM problems WHERE id = ?').run(id);

    if (info.changes === 0) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }

    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({ message: 'Internal server error deleting problem' });
  }
}

// Test case management
export function getProblemTestCases(req: Request, res: Response): void {
  try {
    const problemId = Number(req.params.problemId);
    const testCases = db.prepare(`
      SELECT id, problem_id, input, expected_output, is_sample, created_at
      FROM test_cases
      WHERE problem_id = ?
      ORDER BY is_sample DESC, id ASC
    `).all(problemId);

    res.json({ testCases });
  } catch (error) {
    console.error('Error fetching test cases:', error);
    res.status(500).json({ message: 'Internal server error fetching test cases' });
  }
}

export function addTestCase(req: Request, res: Response): void {
  try {
    const problemId = Number(req.params.problemId);
    const { input, expected_output, is_sample = 0 } = req.body;

    if (input === undefined || expected_output === undefined) {
      res.status(400).json({ message: 'input and expected_output are required' });
      return;
    }

    const stmt = db.prepare(`
      INSERT INTO test_cases (problem_id, input, expected_output, is_sample)
      VALUES (?, ?, ?, ?)
    `);

    const info = stmt.run(problemId, input, expected_output, is_sample ? 1 : 0);

    res.status(201).json({
      message: 'Test case added successfully',
      testCaseId: Number(info.lastInsertRowid)
    });
  } catch (error) {
    console.error('Error adding test case:', error);
    res.status(500).json({ message: 'Internal server error adding test case' });
  }
}

export function updateTestCase(req: Request, res: Response): void {
  try {
    const id = Number(req.params.id);
    const { input, expected_output, is_sample } = req.body;

    const stmt = db.prepare(`
      UPDATE test_cases
      SET 
        input = COALESCE(?, input),
        expected_output = COALESCE(?, expected_output),
        is_sample = COALESCE(?, is_sample)
      WHERE id = ?
    `);

    const info = stmt.run(
      input !== undefined ? input : null,
      expected_output !== undefined ? expected_output : null,
      is_sample !== undefined ? (is_sample ? 1 : 0) : null,
      id
    );

    if (info.changes === 0) {
      res.status(404).json({ message: 'Test case not found' });
      return;
    }

    res.json({ message: 'Test case updated successfully' });
  } catch (error) {
    console.error('Error updating test case:', error);
    res.status(500).json({ message: 'Internal server error updating test case' });
  }
}

export function deleteTestCase(req: Request, res: Response): void {
  try {
    const id = Number(req.params.id);
    const info = db.prepare('DELETE FROM test_cases WHERE id = ?').run(id);

    if (info.changes === 0) {
      res.status(404).json({ message: 'Test case not found' });
      return;
    }

    res.json({ message: 'Test case deleted successfully' });
  } catch (error) {
    console.error('Error deleting test case:', error);
    res.status(500).json({ message: 'Internal server error deleting test case' });
  }
}
