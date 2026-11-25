import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { SeedProblem } from '../seed.types.js';

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

function ensureNewline(s: string): string {
  return s.endsWith('\n') ? s : s + '\n';
}

export interface RawProblemDef {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  points: number;
  time_limit: number;
  memory_limit: number;
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  starter_code: string;
  reference_solution: string;
  sample_inputs: Array<{ input: string; explanation?: string }>;
  hidden_inputs: string[];
}

export function compileAndGenerateOutputs(rawProblems: RawProblemDef[]): SeedProblem[] {
  const gxx = getGxxPath();
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'batch-gen-'));
  const results: SeedProblem[] = [];

  try {
    for (let i = 0; i < rawProblems.length; i++) {
      const raw = rawProblems[i];
      const probStart = Date.now();
      const srcPath = path.join(tmpDir, `prob_${i}.cpp`);
      const exePath = path.join(tmpDir, `prob_${i}.exe`);

      fs.writeFileSync(srcPath, raw.reference_solution, 'utf-8');

      // 1. Compile reference solution ONCE with -O2
      const comp = spawnSync(gxx, ['-std=c++20', '-O2', srcPath, '-o', exePath], {
        timeout: 10000,
        env: { ...process.env, PATH: `${path.dirname(gxx)};${process.env.PATH || ''}` }
      });

      if (comp.status !== 0) {
        console.error(`[Generator] Failed to compile "${raw.title}": ${comp.stderr?.toString()}`);
        continue;
      }

      // 2. Generate sample outputs using cached .exe (5s timeout)
      const samples: Array<{ input: string; output: string; explanation?: string }> = [];
      let testsPassed = 0;
      const totalTests = raw.sample_inputs.length + raw.hidden_inputs.length;

      for (let sIdx = 0; sIdx < raw.sample_inputs.length; sIdx++) {
        const s = raw.sample_inputs[sIdx];
        const run = spawnSync(exePath, [], {
          input: ensureNewline(s.input),
          timeout: 5000,
          encoding: 'utf-8',
          env: { ...process.env, PATH: `${path.dirname(gxx)};${process.env.PATH || ''}` }
        });

        if (run.status !== 0) {
          console.warn(`[Generator] Test timed out or error on "${raw.title}" Sample #${sIdx + 1}`);
          continue;
        }

        samples.push({
          input: s.input,
          output: normalizeOutput(run.stdout || ''),
          explanation: s.explanation
        });
        testsPassed++;
      }

      // 3. Generate hidden outputs using cached .exe (5s timeout)
      const hidden: Array<{ input: string; output: string }> = [];
      for (let hIdx = 0; hIdx < raw.hidden_inputs.length; hIdx++) {
        const input = raw.hidden_inputs[hIdx];
        const run = spawnSync(exePath, [], {
          input: ensureNewline(input),
          timeout: 5000,
          encoding: 'utf-8',
          env: { ...process.env, PATH: `${path.dirname(gxx)};${process.env.PATH || ''}` }
        });

        if (run.status !== 0) {
          console.warn(`[Generator] Test timed out or error on "${raw.title}" Hidden #${hIdx + 1}`);
          continue;
        }

        hidden.push({
          input,
          output: normalizeOutput(run.stdout || '')
        });
        testsPassed++;
      }

      results.push({
        title: raw.title,
        slug: raw.slug,
        difficulty: raw.difficulty,
        tags: raw.tags,
        points: raw.points,
        time_limit: raw.time_limit,
        memory_limit: raw.memory_limit,
        description: raw.description,
        input_format: raw.input_format,
        output_format: raw.output_format,
        constraints: raw.constraints,
        starter_code: raw.starter_code,
        reference_solution: raw.reference_solution,
        samples,
        hidden
      });

      const probDuration = Date.now() - probStart;
      console.log(`Problem ${i + 1}/${rawProblems.length} (${raw.title}): ${testsPassed}/${totalTests} tests done in ${probDuration}ms`);

      try {
        if (fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
        if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
      } catch {}
    }
  } finally {
    try {
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    } catch {}
  }

  return results;
}
