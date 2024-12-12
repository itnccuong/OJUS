import {
  ProblemInterface,
  ProblemWithUserStatusInterface,
  ResultInterface,
  SubmissionInterface,
  TestcaseInterface,
  UserInterface,
} from "./model.interface.ts";

export interface ResponseInterface<T> {
  message: string;
  data: T;
}

export interface LoginResponseInterface {
  user: UserInterface;
  token: string;
}

export interface RegisterResponseInterface {
  user: UserInterface;
}

export interface OneContributionResponseInterface {
  contribution: ProblemInterface;
}

export interface ContributionListResponseInterface {
  contributions: ProblemInterface[];
}

export interface SubmitCodeResponseInterface {
  submission: SubmissionInterface;
  results: ResultInterface[];
  testcases: TestcaseInterface;
}

export interface OneProblemResponseInterface {
  problem: ProblemWithUserStatusInterface;
}

export interface ProblemListResponseInterface {
  problems: ProblemWithUserStatusInterface[];
}

export interface SubmissionListResponseInterface {
  submissions: SubmissionInterface[];
}

export interface GetSubmissionResponseInterface {
  submission: SubmissionInterface;
  results: ResultInterface[];
  testcases: TestcaseInterface;
  problem: ProblemInterface;
}
