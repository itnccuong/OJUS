import { expect } from "@jest/globals";
import { STATUS_CODE, verdict } from "../utils/constants";
import { Problem, Result, Submission } from "@prisma/client";
import { getSubmitCodeResults } from "./test_utils";
import { get } from "http";

export const testCompile = async (
  problem: Problem,
  code: string,
  language: string,
  isCompileError: boolean,
  token: string,
) => {

  // let submitCodeResponse, getSubmissionResponse, getResultResponse;
  const { submitCodeResponse, getSubmissionResponse, getResultResponse } =
  await getSubmitCodeResults(problem.problemId, code, language, token);

  expect(getSubmissionResponse.body.data.submission.problemId).toBe(
    problem.problemId,
  );
  if (isCompileError) {
    expect(submitCodeResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getSubmissionResponse.body.data.submission.verdict).toBe(
      verdict.COMPILE_ERROR,
    );
    expect(getSubmissionResponse.body.data.submission.stderr).toBeTruthy();
    expect(getResultResponse.body.data.results.length).toBe(0);
  } else {
    expect(getSubmissionResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getSubmissionResponse.body.data.submission.verdict).not.toBe(
      verdict.COMPILE_ERROR,
    );
    expect(getResultResponse.body.data.results.length).toBeGreaterThan(0);
  }
};

export const testCorrect = async (
  problem: Problem,
  code: string,
  language: string,
  token: string,
) => {
  const { submitCodeResponse, getSubmissionResponse, getResultResponse } =
    await getSubmitCodeResults(problem.problemId, code, language, token);

  expect(submitCodeResponse.status).toBe(STATUS_CODE.SUCCESS);

  expect(getSubmissionResponse.body.data.submission.verdict).toBe(verdict.OK);
  expect(getSubmissionResponse.body.data.submission.stderr).toBeFalsy();

  expect(getResultResponse.body.data.results.length).toBeGreaterThan(0);
  getResultResponse.body.data.results.map((result) => {
    expect(result.verdict).toBe(verdict.OK);
    expect(result.time).toBeLessThan(problem.timeLimit);
    expect(result.memory).toBeLessThan(problem.memoryLimit);
  });
};
