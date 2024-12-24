export interface UserInterface {
  userId: number;
  email: string;
  fullname: string;
  username: string;
  githubLink: string;
  facebookLink: string;
  avatarId: number;
  created_at: string;
}

export interface FileInterface {
  fileId: number;
  filename: string;
  filesize: number;
  fileType: string;
  url: string;
  createdAt: string;
  bucket: string;
  key: string;
}

export interface UserWithAvatarInterface extends UserInterface {
  avatar: FileInterface;
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
  fullname?: string;
  gender?: string;
  birthday?: Date | null;
  facebookLink?: string | null;
  githubLink?: string | null;
  currentPassword?: string;
  newPassword?: string;
}

export interface ResponseInterface<T> {
  message: string;
  data: T;
}
