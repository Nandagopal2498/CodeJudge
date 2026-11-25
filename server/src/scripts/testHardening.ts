import { judgeSubmission } from '../judge/judge.service.js';
import fs from 'fs';
import os from 'os';

async function runHardeningTests() {
  const dummyTc = [{ input: '10', expected_output: '10' }];

  console.log('=== TEST 1: Infinite Loop (Time limit exceeded & killed) ===');
  const infLoopCode = `
    volatile long long counter = 0;
    int main() {
      while(true) {
        counter++;
      }
      return 0;
    }
  `;
  const t1 = await judgeSubmission(infLoopCode, dummyTc, 500);
  console.log('Result 1:', { verdict: t1.verdict, runtimeMs: t1.runtimeMs });

  console.log('\n=== TEST 2: Huge Memory Allocation (bad_alloc / OOM) ===');
  const hugeMemCode = `
    #include <new>
    int main() {
      size_t sz = 18446744073709551615ULL;
      char* p = new char[sz];
      return 0;
    }
  `;
  const t2 = await judgeSubmission(hugeMemCode, dummyTc, 1000);
  console.log('Result 2:', { verdict: t2.verdict, error: t2.details?.[0]?.errorMessage });

  console.log('\n=== TEST 3: Endless Output Stream (> 256 KB) ===');
  const endlessOutputCode = `
    #include <iostream>
    using namespace std;
    int main() {
      for (int i = 0; i < 500000; i++) {
        cout << "1234567890abcdefghijklmnopqrstuvwxyz\\n";
      }
      return 0;
    }
  `;
  const t3 = await judgeSubmission(endlessOutputCode, dummyTc, 2000, true);
  console.log('Result 3:', { verdict: t3.verdict, error: t3.details?.[0]?.errorMessage });

  console.log('\n=== TEST 4: Dangerous system("dir") Call ===');
  const systemDirCode = `
    #include <cstdlib>
    int main() {
      system("dir");
      return 0;
    }
  `;
  const t4 = await judgeSubmission(systemDirCode, dummyTc, 1000);
  console.log('Result 4:', { verdict: t4.verdict, reason: t4.compilationError });

  console.log('\n=== TEST 5: Block Restricted Headers (<fstream>, <filesystem>) ===');
  const fstreamCode = `
    #include <fstream>
    int main() {
      std::ofstream f("test.txt");
      f << "hello";
      return 0;
    }
  `;
  const t5 = await judgeSubmission(fstreamCode, dummyTc, 1000);
  console.log('Result 5 (<fstream>):', { verdict: t5.verdict, reason: t5.compilationError });

  const fsCode = `
    #include <filesystem>
    int main() {
      return 0;
    }
  `;
  const t5b = await judgeSubmission(fsCode, dummyTc, 1000);
  console.log('Result 5 (<filesystem>):', { verdict: t5b.verdict, reason: t5b.compilationError });

  console.log('\n=== TEST 6: Code Size Limit (> 64 KB) ===');
  const largeCode = '// padding\n'.repeat(7000) + 'int main() { return 0; }';
  const t6 = await judgeSubmission(largeCode, dummyTc, 1000);
  console.log('Result 6 (> 64 KB):', { verdict: t6.verdict, reason: t6.compilationError });

  console.log('\n=== TEST 7: Normal Valid Solution (Sanity Check) ===');
  const validCode = `
    #include <iostream>
    using namespace std;
    int main() {
      int x;
      if (cin >> x) {
        cout << x << endl;
      }
      return 0;
    }
  `;
  const t7 = await judgeSubmission(validCode, dummyTc, 1000, true);
  console.log('Result 7:', { verdict: t7.verdict, runtimeMs: t7.runtimeMs });

  console.log('\n=== TEST 8: Temp Folder Cleanup Verification ===');
  const tmpEntries = fs.readdirSync(os.tmpdir()).filter(f => f.startsWith('codejudge-'));
  console.log('Active codejudge- temp directories remaining in os.tmpdir():', tmpEntries.length);
}

runHardeningTests().catch(console.error);
