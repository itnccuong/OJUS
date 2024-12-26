import request from "supertest";
import { app } from "../src/app";
import {
  ErrorResponseInterface,
  ResponseInterfaceForTest,
} from "../interfaces/interface";
import { expect } from "@jest/globals";
import { STATUS_CODE } from "../utils/constants";
import { Result, Submission } from "@prisma/client";

export const testCompile = async (
  code: string,
  language: string,
  isCompileError: boolean,
  token: string,
) => {
  const submitCodeResponse = (await request(app)
    .post(`/api/problems/1`)
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

  if (isCompileError) {
    expect(submitCodeResponse.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(getSubmissionResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getSubmissionResponse.body.data.submission.verdict).toBe(
      "COMPILE_ERROR",
    );
    expect(getSubmissionResponse.body.data.submission.stderr).toBeTruthy();
    expect(getResultResponse.body.data.results.length).toBe(0);
  } else {
    expect(getSubmissionResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getSubmissionResponse.body.data.submission.verdict).not.toBe(
      "COMPILE_ERROR",
    );
    expect(getResultResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getResultResponse.body.data.results.length).toBeGreaterThan(0);
  }
};

export const testCorrect = async (
  code: string,
  language: string,
  token: string,
) => {
  const res = (await request(app)
    .post(`/api/problems/1`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      code,
      language,
    })) as ResponseInterfaceForTest<{}>;
  expect(res.status).toBe(STATUS_CODE.SUCCESS);
};
