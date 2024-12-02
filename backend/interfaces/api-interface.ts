import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { TestcaseInterface } from "./code-executor-interface";

export interface CustomRequest<T, P extends ParamsDictionary> extends Request {
  body: T;
  params: P;
}

// export interface SuccessResponse<T> {
//   status: number;
//   body: {
//     data: T;
//   };
// }
//
// export interface ErrorResponse<T> {
//   status: number;
//   body: {
//     name: string;
//     message: string;
//     data: T;
//   };
// }

export interface ResponseInterface<T> {
  status: number;
  body: T;
}

export interface UserConfig {
  userId: number;
  username: string;
  email: string;
  fullname: string;
  password: string;
}

export interface LoginInterface {
  usernameOrEmail: string;
  password: string;
}

export interface LoginSuccessData {
  token: string;
}

export interface RegisterSuccessData {
  user: UserConfig;
}

export interface RegisterConfig {
  email: string;
  username: string;
  password: string;
  fullname: string;
}

export interface SubmitCodeConfig {
  code: string;
  language: string;
}

export interface ProblemParamsInterface extends ParamsDictionary {
  problem_id: string;
}

export interface ChangePasswordConfig {
  token: string;
  newPassword: string;
}

export interface SendResetLinkConfig {
  email: string;
}

export interface SubmissionConfig {
  submissionId: number;
  problemId: number;
  userId: number;
  code: string;
  language: string;
  verdict: string;
  createdAt: Date;
}

export interface ResultConfig {
  submissionId: number;
  verdict: string;
  resultId: number;
  output: string;
  testcaseIndex: number;
  time: number;
  memory: number;
  createdAt: Date;
}

export interface ProblemInterface {
  problemId: number;
  title: string;
  description: string;
  status: number;
  difficulty: number;
  tags: string;
  timeLimit: number;
  memoryLimit: number;
  authorId: number;
  fileId: number;
}

export interface SubmitCodeResponseInterface {
  data: {
    submission: SubmissionConfig;
    results: ResultConfig[];
    testcases: TestcaseInterface;
  };
  message: string;
}

export interface CompileErrorResponseInterface {
  name: string;
  message: string;
  data: {
    stderr: string;
    submission: SubmissionConfig;
    testcases: TestcaseInterface;
  };
}

//Wrong answer, runtime, memory, time limit
export interface FailTestResponseInterface {
  name: string;
  message: string;
  data: {
    stderr: string;
    submission: SubmissionConfig;
    results: ResultConfig[];
    testcases: TestcaseInterface;
  };
}
