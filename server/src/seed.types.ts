export interface SeedProblem {
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
  samples: Array<{ input: string; output: string; explanation?: string }>;
  hidden: Array<{ input: string; output: string }>;
}
