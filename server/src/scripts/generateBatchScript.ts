import fs from 'fs';
import path from 'path';
import { RawProblemDef, compileAndGenerateOutputs } from '../utils/batchRunner.js';

export function saveGeneratedBatch(rawDefs: RawProblemDef[], outputPath: string, exportName: string) {
  console.log(`[Generator] Generating outputs for ${rawDefs.length} problems using C++ reference solutions...`);
  const problems = compileAndGenerateOutputs(rawDefs);
  const content = `import { SeedProblem } from '../seed.types.js';\n\nexport const ${exportName}: SeedProblem[] = ${JSON.stringify(problems, null, 2)};\n`;
  fs.writeFileSync(outputPath, content, 'utf-8');
  console.log(`[Generator] Successfully wrote ${problems.length} problems to ${outputPath}`);
}
