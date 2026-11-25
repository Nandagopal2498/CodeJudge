export interface ProblemListItem {
  id: number;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  time_limit: number;
  memory_limit: number;
  points: number;
  created_at: string;
  tags?: string[];
  is_solved?: boolean;
}

export interface ProblemDetail extends ProblemListItem {
  description: string;
  input_format: string;
  output_format: string;
  constraints: string;
  starter_code?: string;
  sample_cases: Array<{
    input: string;
    expected_output: string;
  }>;
  prev_problem?: { id: number; title: string; slug: string } | null;
  next_problem?: { id: number; title: string; slug: string } | null;
}
