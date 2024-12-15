import { TestcaseInterface } from "./code-executor-interface";

import type { User, Problem, Result, Submission } from "@prisma/client";

export interface SuccessResponseInterface<T> {
  data: T;
}

export interface ErrorResponseInterface {
  message: string;
}

export interface ResponseInterfaceForTest<T> {
  status: number;
  body: T;
}

export interface decodedResetTokenInterface {
  email: string;
}

export interface LoginInterface {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterConfig {
  email: string;
  username: string;
  password: string;
  fullname: string;
}

export interface RegisterResponseInterface {
  user: User;
}

export interface SubmitCodeConfig {
  code: string;
  language: string;
}

export interface ChangePasswordConfig {
  token: string;
  newPassword: string;
}

export interface SendResetLinkConfig {
  email: string;
}

export interface LoginResponseInterface {
  user: User;
  token: string;
}

export interface SubmitCodeResponseInterface {
  submissionId: number;
}

export interface CompileErrorResponseInterface {
  stderr: string;
  submission: Submission;
  testcases: TestcaseInterface;
}

//Wrong answer, runtime, memory, time limit
export interface FailTestResponseInterface {
  stderr: string;
  submission: Submission;
  results: Result[];
  testcases: TestcaseInterface;
}

export interface ProblemWithUserStatusInterface extends Problem {
  userStatus: boolean;
}

export interface GetAllProblemInterface {
  problems: ProblemWithUserStatusInterface[];
}

export interface GetOneProblemInterface {
  problem: ProblemWithUserStatusInterface;
}

export interface ContributionResponseInterface {
  contribution: Problem;
}

export interface ContributionListResponseInterface {
  contributions: Problem[];
}

export interface SubmissionWithResults extends Submission {
  results: Result[];
}

export interface GetAllSubmissionsInterface {
  submissions: SubmissionWithResults[];
}

export interface GetOneSubmissionInterface {
  submission: Submission;
  // results: Result[];
  // testcases: TestcaseInterface;
  // problem: Problem;
}

export interface GetResultsInterface {
  results: Result[];
}

export interface GetTestcasesInterface {
  testcases: TestcaseInterface;
}
