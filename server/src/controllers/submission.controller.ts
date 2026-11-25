import { Response } from 'express';
import { db } from '../config/db.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';
import { SubmissionModel } from '../models/Submission.js';
import { judgeSubmission, TestCaseInput } from '../judge/judge.service.js';
import { submissionQueue, isUserJudging, setUserJudging, clearUserJudging } from '../queue/judge.queue.js';

interface ProblemRow {
  id: number;
  time_limit: number;
  memory_limit: number;
}

export async function submitSolution(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Allow only one judging job per user at a time
  if (isUserJudging(userId)) {
    res.status(429).json({ message: 'You already have an active judging job running. Please wait for it to complete.' });
    return;
  }

  const { problemId, code, language = 'C++20' } = req.body;
  if (!problemId || !code || typeof code !== 'string') {
    res.status(400).json({ message: 'problemId and code are required' });
    return;
  }

  // Source code size cap: 64 KB
  if (Buffer.byteLength(code, 'utf8') > 64 * 1024) {
    res.status(400).json({ message: 'Code size exceeds 64KB limit' });
    return;
  }

  try {
    const problem = db.prepare('SELECT id, time_limit, memory_limit FROM problems WHERE id = ?').get(problemId) as ProblemRow | undefined;
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }

    // Load all test cases (both sample and hidden) for judging
    const testCases = db.prepare(`
      SELECT input, expected_output, is_sample
      FROM test_cases
      WHERE problem_id = ?
      ORDER BY is_sample DESC, id ASC
    `).all(problemId) as TestCaseInput[];

    if (testCases.length === 0) {
      res.status(400).json({ message: 'No test cases configured for this problem' });
      return;
    }

    setUserJudging(userId);

    // Enqueue judging task (Max 2 concurrent jobs globally)
    const judgeResult = await submissionQueue.add(() =>
      judgeSubmission(code, testCases, problem.time_limit, false, problem.memory_limit)
    );

    // Save submission record
    const saved = SubmissionModel.create(
      userId,
      problemId,
      code,
      judgeResult.verdict,
      judgeResult.runtimeMs,
      language
    );

    res.status(201).json({
      submission: {
        id: saved.id,
        problem_id: saved.problem_id,
        language: saved.language,
        verdict: saved.verdict,
        runtime_ms: saved.runtime_ms,
        created_at: saved.created_at,
        failed_test_index: judgeResult.failedTestIndex,
        total_tests: judgeResult.totalTests,
        passed_tests: judgeResult.passedTests,
        compilation_error: judgeResult.compilationError
      }
    });
  } catch (error) {
    console.error('Submission processing error:', error);
    // Never expose server paths or stack traces to the user
    res.status(500).json({
      submission: {
        verdict: 'System Error',
        runtime_ms: 0,
        total_tests: 0,
        passed_tests: 0
      },
      message: 'System Error: An internal error occurred while processing the submission.'
    });
  } finally {
    clearUserJudging(userId);
  }
}

export async function runSampleTests(req: AuthRequest, res: Response): Promise<void> {
  const userId = req.user?.userId;
  if (!userId) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  // Allow only one judging job per user at a time
  if (isUserJudging(userId)) {
    res.status(429).json({ message: 'You already have an active test execution running. Please wait for it to complete.' });
    return;
  }

  const { problemId, code } = req.body;
  if (!problemId || !code || typeof code !== 'string') {
    res.status(400).json({ message: 'problemId and code are required' });
    return;
  }

  // Source code size cap: 64 KB
  if (Buffer.byteLength(code, 'utf8') > 64 * 1024) {
    res.status(400).json({ message: 'Code size exceeds 64KB limit' });
    return;
  }

  try {
    const problem = db.prepare('SELECT id, time_limit, memory_limit FROM problems WHERE id = ?').get(problemId) as ProblemRow | undefined;
    if (!problem) {
      res.status(404).json({ message: 'Problem not found' });
      return;
    }

    // Only load sample test cases
    const sampleCases = db.prepare(`
      SELECT input, expected_output, is_sample
      FROM test_cases
      WHERE problem_id = ? AND is_sample = 1
      ORDER BY id ASC
    `).all(problemId) as TestCaseInput[];

    if (sampleCases.length === 0) {
      res.status(400).json({ message: 'No sample test cases configured for this problem' });
      return;
    }

    setUserJudging(userId);

    // Enqueue sample run task
    const judgeResult = await submissionQueue.add(() =>
      judgeSubmission(code, sampleCases, problem.time_limit, true, problem.memory_limit)
    );

    res.json({
      verdict: judgeResult.verdict,
      runtime_ms: judgeResult.runtimeMs,
      total_tests: judgeResult.totalTests,
      passed_tests: judgeResult.passedTests,
      compilation_error: judgeResult.compilationError,
      failed_test_index: judgeResult.failedTestIndex,
      details: judgeResult.details
    });
  } catch (error) {
    console.error('Run sample tests error:', error);
    // Never expose server paths or stack traces to the user
    res.status(500).json({
      verdict: 'System Error',
      runtime_ms: 0,
      total_tests: 0,
      passed_tests: 0,
      message: 'System Error: An internal error occurred while running sample tests.'
    });
  } finally {
    clearUserJudging(userId);
  }
}

export function getUserSubmissions(req: AuthRequest, res: Response): void {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const submissions = SubmissionModel.findByUserId(userId);
    res.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Internal server error fetching submissions' });
  }
}
