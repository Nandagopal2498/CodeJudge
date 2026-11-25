import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawn } from 'child_process';
import pidusage from 'pidusage';
import { JudgeResult, RunTestResult } from './judge.types.js';
import { validateCodeSecurity } from './security.validator.js';

function getGxxPath(): string {
  const winGetGxx = 'C:\\Users\\nanda\\AppData\\Local\\Microsoft\\WinGet\\Packages\\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyb3d8bbwe\\mingw64\\bin\\g++.exe';
  if (fs.existsSync(winGetGxx)) {
    return winGetGxx;
  }
  return 'g++';
}

function normalizeOutput(out: string): string {
  return out
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trimEnd();
}

/**
 * Kill process and its entire child process tree.
 */
function killProcessTree(pid: number | undefined): void {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', pid.toString(), '/T', '/F']);
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch {
    try {
      if (process.platform !== 'win32') {
        process.kill(pid, 'SIGKILL');
      }
    } catch {}
  }
}

export interface TestCaseInput {
  input: string;
  expected_output: string;
  is_sample?: number;
}

export async function judgeSubmission(
  code: string,
  testCases: TestCaseInput[],
  timeLimitMs: number = 1000,
  includeDetails: boolean = false,
  memoryLimitMB: number = 256
): Promise<JudgeResult> {
  // 1. Static security validation
  try {
    const securityCheck = validateCodeSecurity(code);
    if (!securityCheck.isSafe) {
      return {
        verdict: securityCheck.verdict || 'Compilation Error',
        runtimeMs: 0,
        compilationError: securityCheck.reason,
        totalTests: testCases.length,
        passedTests: 0
      };
    }
  } catch {
    return {
      verdict: 'System Error',
      runtimeMs: 0,
      totalTests: testCases.length,
      passedTests: 0
    };
  }

  // 2. Temp directory per submission
  let tmpDir = '';
  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codejudge-'));
  } catch {
    return {
      verdict: 'System Error',
      runtimeMs: 0,
      totalTests: testCases.length,
      passedTests: 0
    };
  }

  const sourceFile = path.join(tmpDir, 'solution.cpp');
  const exeFile = path.join(tmpDir, process.platform === 'win32' ? 'solution.exe' : 'solution');

  // Hard limits
  const MAX_OUTPUT_BYTES = 1024 * 1024; // 1 MB output cap to prevent disk filling
  const COMPILE_TIMEOUT_MS = 10000; // 10s compile timeout

  try {
    fs.writeFileSync(sourceFile, code, 'utf-8');

    // 3. Compilation step with 10s timeout protection
    const gxx = getGxxPath();
    const compileResult = await new Promise<{ success: boolean; stderr: string; timedOut: boolean }>((resolve) => {
      let proc: any;
      let stderr = '';
      let timedOut = false;

      const compileTimer = setTimeout(() => {
        timedOut = true;
        if (proc?.pid) {
          killProcessTree(proc.pid);
        }
      }, COMPILE_TIMEOUT_MS);

      try {
        proc = spawn(gxx, ['-std=c++20', '-O3', sourceFile, '-o', exeFile], {
          cwd: tmpDir,
          env: {
            ...process.env,
            PATH: `${path.dirname(gxx)};${process.env.PATH || ''}`
          }
        });

        proc.stderr?.on('data', (d: Buffer) => {
          if (stderr.length < 8192) {
            stderr += d.toString();
          }
        });

        proc.on('close', (exitCode: number | null) => {
          clearTimeout(compileTimer);
          resolve({ success: exitCode === 0 && !timedOut, stderr, timedOut });
        });

        proc.on('error', (err: Error) => {
          clearTimeout(compileTimer);
          resolve({ success: false, stderr: err.message, timedOut: false });
        });
      } catch (err: any) {
        clearTimeout(compileTimer);
        resolve({ success: false, stderr: err.message, timedOut: false });
      }
    });

    if (compileResult.timedOut) {
      return {
        verdict: 'Compilation Error',
        runtimeMs: 0,
        compilationError: 'Compilation timed out (exceeded 10 seconds limit).',
        totalTests: testCases.length,
        passedTests: 0
      };
    }

    if (!compileResult.success) {
      // Clean up server paths from compiler error message to avoid leaking local filesystem
      const sanitizedStderr = compileResult.stderr
        .replace(new RegExp(tmpDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), 'solution')
        .replace(/^[A-Za-z]:\\[^\n:]*solution\.cpp/gm, 'solution.cpp')
        .slice(0, 4000);

      return {
        verdict: 'Compilation Error',
        runtimeMs: 0,
        compilationError: sanitizedStderr || 'Compilation failed.',
        totalTests: testCases.length,
        passedTests: 0
      };
    }

    // 4. Execution across test cases
    let maxRuntimeMs = 0;
    let passedTests = 0;
    const details: RunTestResult[] = [];
    const memoryLimitBytes = memoryLimitMB * 1024 * 1024;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const start = process.hrtime();

      const runRes = await new Promise<{
        stdout: string;
        stderr: string;
        exitCode: number | null;
        timedOut: boolean;
        outputLimitExceeded: boolean;
        memoryLimitExceeded: boolean;
      }>((resolve) => {
        let child: any;
        let stdout = '';
        let stderr = '';
        let timedOut = false;
        let outputLimitExceeded = false;
        let memoryLimitExceeded = false;
        let memInterval: NodeJS.Timeout | null = null;
        let isDone = false;

        const cleanupAndResolve = (result: {
          stdout: string;
          stderr: string;
          exitCode: number | null;
          timedOut: boolean;
          outputLimitExceeded: boolean;
          memoryLimitExceeded: boolean;
        }) => {
          if (isDone) return;
          isDone = true;
          clearTimeout(timeoutTimer);
          if (memInterval) clearInterval(memInterval);
          if (child?.pid) {
            try {
              pidusage.clear();
            } catch {}
          }
          resolve(result);
        };

        // Time limit enforcement: kill process tree on timeout
        const timeoutTimer = setTimeout(() => {
          timedOut = true;
          if (child?.pid) {
            killProcessTree(child.pid);
          }
        }, timeLimitMs + 100);

        try {
          child = spawn(exeFile, [], {
            cwd: tmpDir,
            env: {
              ...process.env,
              PATH: `${path.dirname(gxx)};${process.env.PATH || ''}`
            }
          });

          // Memory polling via pidusage every 50ms
          memInterval = setInterval(async () => {
            if (!child?.pid || isDone) return;
            try {
              const stats = await pidusage(child.pid);
              if (stats && stats.memory > memoryLimitBytes) {
                memoryLimitExceeded = true;
                killProcessTree(child.pid);
              }
            } catch {
              // Process might have terminated, ignore
            }
          }, 50);

          child.stdout?.on('data', (d: Buffer) => {
            stdout += d.toString();
            // Output cap: 1 MB
            if (stdout.length > MAX_OUTPUT_BYTES) {
              outputLimitExceeded = true;
              killProcessTree(child.pid);
            }
          });

          child.stderr?.on('data', (d: Buffer) => {
            if (stderr.length < 16384) {
              stderr += d.toString();
            }
          });

          child.on('close', (exitCode: number | null) => {
            cleanupAndResolve({ stdout, stderr, exitCode, timedOut, outputLimitExceeded, memoryLimitExceeded });
          });

          child.on('error', () => {
            cleanupAndResolve({ stdout, stderr, exitCode: 1, timedOut, outputLimitExceeded, memoryLimitExceeded });
          });

          try {
            child.stdin.write(tc.input);
            child.stdin.end();
          } catch {
            // Process terminated early
          }
        } catch {
          cleanupAndResolve({ stdout: '', stderr: '', exitCode: 1, timedOut: false, outputLimitExceeded: false, memoryLimitExceeded: false });
        }
      });

      const elapsed = process.hrtime(start);
      const executionMs = Math.round(elapsed[0] * 1000 + elapsed[1] / 1e6);
      if (executionMs > maxRuntimeMs) {
        maxRuntimeMs = executionMs;
      }

      if (runRes.timedOut) {
        const detail: RunTestResult = {
          testIndex: i + 1,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: runRes.stdout.slice(0, 500),
          status: 'Time Limit Exceeded',
          runtimeMs: timeLimitMs
        };
        details.push(detail);

        return {
          verdict: 'Time Limit Exceeded',
          runtimeMs: timeLimitMs,
          failedTestIndex: i + 1,
          totalTests: testCases.length,
          passedTests,
          details: includeDetails ? details : undefined
        };
      }

      if (runRes.memoryLimitExceeded) {
        const detail: RunTestResult = {
          testIndex: i + 1,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: runRes.stdout.slice(0, 500),
          status: 'Memory Limit Exceeded',
          runtimeMs: executionMs,
          errorMessage: `Memory Limit Exceeded (> ${memoryLimitMB} MB used).`
        };
        details.push(detail);

        return {
          verdict: 'Memory Limit Exceeded',
          runtimeMs: executionMs,
          failedTestIndex: i + 1,
          totalTests: testCases.length,
          passedTests,
          details: includeDetails ? details : undefined
        };
      }

      if (runRes.outputLimitExceeded) {
        const detail: RunTestResult = {
          testIndex: i + 1,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: 'Output Limit Exceeded (> 1 MB generated)',
          status: 'Runtime Error',
          runtimeMs: executionMs,
          errorMessage: 'Output size cap of 1 MB exceeded.'
        };
        details.push(detail);

        return {
          verdict: 'Runtime Error',
          runtimeMs: executionMs,
          failedTestIndex: i + 1,
          totalTests: testCases.length,
          passedTests,
          details: includeDetails ? details : undefined
        };
      }

      // Check non-zero exit code
      if (runRes.exitCode !== 0) {
        // If it was terminated due to memory exhaustion (e.g. std::bad_alloc)
        const isBadAlloc = runRes.stderr.includes('bad_alloc');
        const verdict = isBadAlloc ? 'Memory Limit Exceeded' : 'Runtime Error';

        const detail: RunTestResult = {
          testIndex: i + 1,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: runRes.stdout.slice(0, 500),
          status: verdict,
          runtimeMs: executionMs,
          errorMessage: isBadAlloc ? 'std::bad_alloc: Memory limit exceeded' : (runRes.stderr || 'Non-zero exit code')
        };
        details.push(detail);

        return {
          verdict,
          runtimeMs: executionMs,
          failedTestIndex: i + 1,
          totalTests: testCases.length,
          passedTests,
          details: includeDetails ? details : undefined
        };
      }

      const normalizedActual = normalizeOutput(runRes.stdout);
      const normalizedExpected = normalizeOutput(tc.expected_output);

      if (normalizedActual !== normalizedExpected) {
        const detail: RunTestResult = {
          testIndex: i + 1,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: runRes.stdout.slice(0, 500),
          status: 'Wrong Answer',
          runtimeMs: executionMs
        };
        details.push(detail);

        return {
          verdict: 'Wrong Answer',
          runtimeMs: maxRuntimeMs,
          failedTestIndex: i + 1,
          totalTests: testCases.length,
          passedTests,
          details: includeDetails ? details : undefined
        };
      }

      passedTests++;
      if (includeDetails) {
        details.push({
          testIndex: i + 1,
          input: tc.input,
          expectedOutput: tc.expected_output,
          actualOutput: runRes.stdout,
          status: 'Passed',
          runtimeMs: executionMs
        });
      }
    }

    return {
      verdict: 'Accepted',
      runtimeMs: maxRuntimeMs,
      totalTests: testCases.length,
      passedTests,
      details: includeDetails ? details : undefined
    };
  } catch {
    return {
      verdict: 'System Error',
      runtimeMs: 0,
      totalTests: testCases.length,
      passedTests: 0
    };
  } finally {
    // Guaranteed deletion of temp workspace and .exe after judging whether pass or fail
    try {
      if (tmpDir && fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    } catch {}
  }
}
