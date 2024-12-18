import {
  ProblemInterface,
  ProblemWithUserStatusInterface,
  ResultInterface,
  SubmissionInterface,
  SubmissionWithProblem,
  SubmissionWithResults,
  TestcaseInterface,
  UserInterface,
  UserWithAvatarInterface,
} from "./model.interface.ts";

export interface ResponseInterface<T> {
  message: string;
  data: T;
}

export interface UserResponseInterface {
  user: UserWithAvatarInterface;
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
  submissionId: number;
}

export interface OneProblemResponseInterface {
  problem: ProblemWithUserStatusInterface;
}

export interface ProblemListResponseInterface {
  problems: ProblemWithUserStatusInterface[];
}

export interface SubmissionListWithResultResponseInterface {
  submissions: SubmissionWithResults[];
}

export interface SubmissionListWithProblemResponseInterface {
  submissions: SubmissionWithProblem[];
}

export interface GetSubmissionResponseInterface {
  submission: SubmissionInterface;
}

export interface GetResultsResponseInterface {
  results: ResultInterface[];
}

export interface GetTestcasesResponseInterface {
  testcases: TestcaseInterface;
}
