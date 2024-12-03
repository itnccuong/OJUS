import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { TestcaseInterface } from "./code-executor-interface";

import type { User, Problem, Result, Submission } from "@prisma/client";
export interface CustomRequest<T, P extends ParamsDictionary> extends Request {
  body: T;
  params: P;
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

export interface RegisterResponse {
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

export interface SuccessResponseInterface<T> {
  message: string;
  data: T;
}

export interface ErrorResponseInterface<T> {
  name: string;
  message: string;
  data: T;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SubmitCodeResponseInterface {
  submission: Submission;
  results: Result[];
  testcases: TestcaseInterface;
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
