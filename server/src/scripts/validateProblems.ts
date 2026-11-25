import fs from 'fs';
import path from 'path';
import os from 'os';
import { spawnSync } from 'child_process';
import { SeedProblem } from '../seed.types.js';

function getGxxPath(): string {
  const winGetGxx = 'C:\\Users\\nanda\\AppData\\Local\\Microsoft\\WinGet\\Packages\\BrechtSanders.WinLibs.POSIX.UCRT_Microsoft.Winget.Source_8wekyd3d8bbwe\\mingw64\\bin\\g++.exe';
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

export function validateAllProblems() {
  const problemsPath = path.resolve('server/src/seedData/allEasy20.json');
  if (!fs.existsSync(problemsPath)) {
    console.error(`Validation error: ${problemsPath} does not exist`);
    process.exit(1);
  }

  const problemsToValidate: SeedProblem[] = JSON.parse(fs.readFileSync(problemsPath, 'utf8'));

  console.log(`\n==================================================`);
  console.log(`VALIDATING ${problemsToValidate.length} ALGORITHMIC PROBLEMS (IDs 6 to 25)`);
  console.log(`==================================================\n`);

  const gxx = getGxxPath();
  const slugs = new Set<string>();
  const titles = new Set<string>();

  let passedCount = 0;
  let failedCount = 0;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'val-problems-'));

  try {
    for (let i = 0; i < problemsToValidate.length; i++) {
      const p = problemsToValidate[i];
      const prefix = `[#${i + 6} ${p.title} (${p.difficulty})]`;
      let probOk = true;

      // 1. Difficulty
      if (p.difficulty !== 'Easy') {
        console.error(`${prefix} INVALID DIFFICULTY: ${p.difficulty} (expected Easy)`);
        probOk = false;
      }

      // 2. Uniqueness
      if (slugs.has(p.slug)) {
        console.error(`${prefix} DUPLICATE SLUG: ${p.slug}`);
        probOk = false;
      }
      slugs.add(p.slug);

      if (titles.has(p.title)) {
        console.error(`${prefix} DUPLICATE TITLE: ${p.title}`);
        probOk = false;
      }
      titles.add(p.title);

      // 3. Points & limits
      if (p.points !== 100) {
        console.error(`${prefix} INVALID POINTS: ${p.points} (expected 100)`);
        probOk = false;
      }
      if (p.time_limit !== 1000) {
        console.error(`${prefix} INVALID TIME LIMIT: ${p.time_limit} (expected 1000ms)`);
        probOk = false;
      }
      if (!p.memory_limit || p.memory_limit < 256) {
        console.error(`${prefix} INVALID MEMORY LIMIT: ${p.memory_limit} (expected >= 256MB)`);
        probOk = false;
      }

      // 4. Topic tags
      if (!p.tags || !Array.isArray(p.tags) || p.tags.length === 0) {
        console.error(`${prefix} MISSING TOPIC TAGS`);
        probOk = false;
      }

      // 5. Starter code validation (C++20 starter code)
      if (!p.starter_code || typeof p.starter_code !== 'string' || !p.starter_code.includes('int main()')) {
        console.error(`${prefix} MISSING OR INVALID STARTER CODE`);
        probOk = false;
      }

      // 6. Sample cases (2 to 3 with explanations)
      if (!p.samples || p.samples.length < 2 || p.samples.length > 3) {
        console.error(`${prefix} INVALID SAMPLES COUNT: ${p.samples?.length} (expected 2 to 3)`);
        probOk = false;
      }
      for (const s of p.samples) {
        if (!s.explanation) {
          console.warn(`${prefix} Sample missing explanation`);
        }
      }

      // 7. Hidden cases (8 to 15)
      if (!p.hidden || p.hidden.length < 8 || p.hidden.length > 15) {
        console.error(`${prefix} INVALID HIDDEN CASES COUNT: ${p.hidden?.length} (expected 8 to 15)`);
        probOk = false;
      }

      // 8. Compile Reference Solution once and test against samples and hidden cases
      if (!p.reference_solution || !p.reference_solution.includes('int main()')) {
        console.error(`${prefix} MISSING REFERENCE SOLUTION`);
        probOk = false;
        failedCount++;
        continue;
      }

      const srcPath = path.join(tmpDir, `val_ref_${i}.cpp`);
      const exePath = path.join(tmpDir, `val_ref_${i}.exe`);
      fs.writeFileSync(srcPath, p.reference_solution, 'utf-8');

      const comp = spawnSync(gxx, ['-std=c++20', '-O2', srcPath, '-o', exePath], {
        timeout: 10000,
        env: { ...process.env, PATH: `${path.dirname(gxx)};${process.env.PATH || ''}` }
      });

      if (comp.status !== 0) {
        console.error(`${prefix} REFERENCE SOLUTION COMPILATION FAILED:\n${comp.stderr?.toString().slice(0, 300)}`);
        probOk = false;
        failedCount++;
        continue;
      }

      // Run sample cases
      for (let sIdx = 0; sIdx < p.samples.length; sIdx++) {
        const sc = p.samples[sIdx];
        const run = spawnSync(exePath, [], {
          input: ensureNewline(sc.input),
          timeout: 5000,
          encoding: 'utf-8',
          env: { ...process.env, PATH: `${path.dirname(gxx)};${process.env.PATH || ''}` }
        });

        if (run.status !== 0) {
          console.error(`${prefix} Reference crashed on Sample #${sIdx + 1}: ${run.stderr}`);
          probOk = false;
          break;
        }

        const actualOut = normalizeOutput(run.stdout || '');
        const expectedOut = normalizeOutput(sc.output || '');
        if (actualOut !== expectedOut) {
          console.error(`${prefix} Sample #${sIdx + 1} output mismatch! Expected: "${expectedOut}", Got: "${actualOut}"`);
          probOk = false;
          break;
        }
      }

      // Run hidden cases
      if (probOk) {
        for (let hIdx = 0; hIdx < p.hidden.length; hIdx++) {
          const hc = p.hidden[hIdx];
          const run = spawnSync(exePath, [], {
            input: ensureNewline(hc.input),
            timeout: 5000,
            encoding: 'utf-8',
            env: { ...process.env, PATH: `${path.dirname(gxx)};${process.env.PATH || ''}` }
          });

          if (run.status !== 0) {
            console.error(`${prefix} Reference crashed on Hidden #${hIdx + 1}: ${run.stderr}`);
            probOk = false;
            break;
          }

          const actualOut = normalizeOutput(run.stdout || '');
          const expectedOut = normalizeOutput(hc.output || '');
          if (actualOut !== expectedOut) {
            console.error(`${prefix} Hidden #${hIdx + 1} output mismatch! Expected: "${expectedOut.slice(0, 50)}", Got: "${actualOut.slice(0, 50)}"`);
            probOk = false;
            break;
          }
        }
      }

      try {
        if (fs.existsSync(srcPath)) fs.unlinkSync(srcPath);
        if (fs.existsSync(exePath)) fs.unlinkSync(exePath);
      } catch {}

      if (probOk) {
        passedCount++;
        console.log(`✓ ${prefix} Passed all checks (${p.samples.length} samples, ${p.hidden.length} hidden)`);
      } else {
        failedCount++;
      }
    }
  } finally {
    try {
      if (fs.existsSync(tmpDir)) {
        fs.rmSync(tmpDir, { recursive: true, force: true });
      }
    } catch {}
  }

  console.log(`\n==================================================`);
  console.log(`VALIDATION SUMMARY`);
  console.log(`Total Problems Evaluated: ${problemsToValidate.length}`);
  console.log(`Passed: ${passedCount}`);
  console.log(`Failed: ${failedCount}`);
  console.log(`Status: ${failedCount === 0 ? 'ALL PASSED OK' : 'FAILED'}`);
  console.log(`==================================================\n`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

validateAllProblems();
