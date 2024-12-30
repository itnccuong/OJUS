import prisma from "../prisma/client";
import { Files, Problem, Result, Submission, User } from "@prisma/client";
import request from "supertest";
import { app } from "../src/app";
import { ResponseInterfaceForTest } from "../interfaces/interface";
import { expect } from "@jest/globals";
import { STATUS_CODE, verdict } from "../utils/constants";

export const cleanDatabase = async () => {
  const deleteResult = prisma.result.deleteMany();
  const deleteSubmission = prisma.submission.deleteMany();
  const deleteFile = prisma.files.deleteMany();
  const deleteProblem = prisma.problem.deleteMany();
  const deleteUser = prisma.user.deleteMany();

  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
  await prisma.$transaction([
    deleteUser,
    deleteFile,
    deleteProblem,
    deleteSubmission,
    deleteResult,
  ]);
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
};

export const insertUser = async (user: User) => {
  await prisma.user.create({
    data: user,
  });
};

export const insertProblem = async (problem: Problem) => {
  await prisma.problem.create({
    data: problem,
  });
};

export const insertFile = async (file: Files) => {
  await prisma.files.create({
    data: file,
  });
};

export const insertSubmission = async (submission: Submission) => {
  await prisma.submission.create({
    data: submission,
  });
};

export const insertResult = async (result: Result) => {
  await prisma.result.create({
    data: result,
  });
};
export const getSubmitCodeResults = async (
  problemId: number,
  code: string,
  language: string,
  token: string,
) => {
  const res = (await request(app)
    .post(`/api/problems/${problemId}`)
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
  expect(res.body.data.submissionId).toBeTruthy();

  expect(getSubmissionResponse.status).toBe(STATUS_CODE.SUCCESS);
  expect(getResultResponse.status).toBe(STATUS_CODE.SUCCESS);

  expect(getSubmissionResponse.body.data.submission.problemId).toBe(problemId);
  getResultResponse.body.data.results.map((result) => {
    expect(result.submissionId).toBe(res.body.data.submissionId);
  });

  return {
    submitCodeResponse: res,
    getSubmissionResponse: getSubmissionResponse,
    getResultResponse: getResultResponse,
  };
};
