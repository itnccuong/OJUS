import type { User, Problem, Result, Submission, Files } from "@prisma/client";

export interface SuccessResponseInterface<T> {
  data: T;
}

export interface ErrorResponseInterface<T> {
  data: T;
  message: string;
}

export interface ResponseInterfaceForTest<T> {
  status: number;
  body: {
    data: T;
    message?: string;
  };
}

export interface ProblemWithUserStatusInterface extends Problem {
  userStatus: boolean;
}

export interface SubmissionWithResults extends Submission {
  results: Result[];
}

export interface SubmissionWithProblem extends Submission {
  problem: Problem;
}

export interface UserWithAvatarInterface extends User {
  avatar: Files | null;
}
