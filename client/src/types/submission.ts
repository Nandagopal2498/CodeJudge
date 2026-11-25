export interface SubmissionItem {
  id: number;
  user_id: number;
  problem_id: number;
  code: string;
  language?: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error' | 'Pending';
  runtime_ms: number;
  created_at: string;
  problem_title?: string;
  problem_slug?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  total_tests?: number;
  passed_tests?: number;
  failed_test_index?: number;
}

export interface RunTestDetail {
  testIndex: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: 'Passed' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  runtimeMs: number;
  errorMessage?: string;
}

export interface RunTestsResponse {
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error';
  runtime_ms: number;
  total_tests: number;
  passed_tests: number;
  compilation_error?: string;
  failed_test_index?: number;
  details?: RunTestDetail[];
}

export interface SubmitResponse {
  submission: {
    id: number;
    problem_id: number;
    verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Runtime Error';
    runtime_ms: number;
    created_at: string;
    failed_test_index?: number;
    total_tests: number;
    passed_tests: number;
    compilation_error?: string;
  };
}
