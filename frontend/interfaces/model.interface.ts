export interface UserInterface {
  user_id: number;
  email: string;
  full_name: string;
  username: string;
  created_at: string;
}

export interface ProblemInterface {
  fileId: number;
  authorId: number;
  memoryLimit: number;
  timeLimit: number;
  tags: string;
  difficulty: number;
  status: number;
  description: string;
  title: string;
  createdAt: string;
  problemId: number;
}

export interface SubmissionInterface {
  createdAt: string;
  verdict: string;
  language: string;
  code: string;
  userId: number;
  problemId: number;
  submissionId: number;
}

export interface ResultInterface {
  memory: number;
  time: number;
  testcaseIndex: number;
  output: string;
  resultId: number;
  createdAt: string;
  verdict: string;
  submissionId: number;
}

export interface TestcaseInterface {
  input: string[];
  output: string[];
}
