import request from "supertest";
import { app } from "../src/app";
import { ResponseInterfaceForTest } from "../interfaces/interface";
import { expect } from "@jest/globals";
import { STATUS_CODE, verdict } from "../utils/constants";
import { Problem, Result, Submission } from "@prisma/client";
import { problem1 } from "./test_data";
import prisma from "../prisma/client";

export const testCompile = async (
  problemId: number,
  code: string,
  language: string,
  isCompileError: boolean,
  token: string,
) => {
  const submitCodeResponse = (await request(app)
    .post(`/api/problems/${problemId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      code,
      language,
    })) as ResponseInterfaceForTest<{ submissionId: number }>;

  const submissionId = submitCodeResponse.body.data.submissionId;

  const getSubmissionResponse = (await request(app).get(
    `/api/submissions/${submissionId}`,
  )) as ResponseInterfaceForTest<{
    submission: Submission;
  }>;

  const getResultResponse = (await request(app).get(
    `/api/submissions/${submissionId}/results`,
  )) as ResponseInterfaceForTest<{ results: Result[] }>;

  expect(getSubmissionResponse.body.data.submission.problemId).toBe(problemId);
  if (isCompileError) {
    expect(submitCodeResponse.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(getSubmissionResponse.status).toBe(STATUS_CODE.SUCCESS);
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
    expect(getResultResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getResultResponse.body.data.results.length).toBeGreaterThan(0);
  }
};

export const testCorrect = async (
  problem: Problem,
  code: string,
  language: string,
  token: string,
) => {
  const res = (await request(app)
    .post(`/api/problems/${problem.problemId}`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      code,
      language,
    })) as ResponseInterfaceForTest<{ submissionId: number }>;

  const submissionId = res.body.data.submissionId;

  const getSubmissionResponse = (await request(app).get(
    `/api/submissions/${submissionId}`,
  )) as ResponseInterfaceForTest<{
    submission: Submission;
  }>;

  const getResultResponse = (await request(app).get(
    `/api/submissions/${submissionId}/results`,
  )) as ResponseInterfaceForTest<{ results: Result[] }>;

  expect(res.status).toBe(STATUS_CODE.SUCCESS);
  expect(getSubmissionResponse.body.data.submission.problemId).toBe(
    problem.problemId,
  );
  expect(getSubmissionResponse.status).toBe(STATUS_CODE.SUCCESS);
  expect(getSubmissionResponse.body.data.submission.verdict).toBe(verdict.OK);
  expect(getSubmissionResponse.body.data.submission.stderr).toBeFalsy();

  expect(getResultResponse.status).toBe(STATUS_CODE.SUCCESS);
  expect(getResultResponse.body.data.results.length).toBeGreaterThan(0);
  getResultResponse.body.data.results.map((result) => {
    expect(result.submissionId).toBe(submissionId);
    expect(result.verdict).toBe(verdict.OK);
    expect(result.time).toBeLessThan(problem.timeLimit);
    expect(result.memory).toBeLessThan(problem.memoryLimit);
  });
};
