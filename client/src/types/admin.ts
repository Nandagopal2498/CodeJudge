export interface AdminTestCase {
  id: number;
  problem_id: number;
  input: string;
  expected_output: string;
  is_sample: number;
  created_at: string;
}

export interface ProblemInputData {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  time_limit: number;
  memory_limit: number;
  points: number;
}
