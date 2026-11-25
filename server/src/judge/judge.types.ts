export interface RunTestResult {
  testIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: 'Passed' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'System Error';
  runtimeMs: number;
  errorMessage?: string;
}

export interface JudgeResult {
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Compilation Error' | 'Runtime Error' | 'System Error';
  runtimeMs: number;
  compilationError?: string;
  failedTestIndex?: number;
  totalTests: number;
  passedTests: number;
  details?: RunTestResult[];
}
