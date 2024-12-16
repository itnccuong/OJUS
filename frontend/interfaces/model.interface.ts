export interface UserInterface {
  userId: number;
  email: string;
  fullname: string;
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

export interface ProblemWithUserStatusInterface extends ProblemInterface {
  userStatus: boolean;
}

export interface SubmissionInterface {
  createdAt: string;
  verdict: string;
  language: string;
  code: string;
  userId: number;
  problemId: number;
  submissionId: number;
  stderr: string;
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

export interface SubmissionWithResults extends SubmissionInterface {
  results: ResultInterface[];
}

export interface SubmissionWithProblem extends SubmissionInterface {
  problem: ProblemInterface;
}

export interface ProfilePayloadInterface {
  fullname?: string; // Optional, as not all cases set this
  gender?: string; // Assuming gender is a string
  birthday?: Date | null; // Can be a Date or null
  facebookLink?: string | null; // Can be a string or null
  githubLink?: string | null; // Can be a string or null
  currentPassword?: string; // For password updates
  newPassword?: string; // For password updates
}
