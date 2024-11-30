import prisma from "../prisma/client";
import request from "supertest";
import { app } from "../src/app";
import {
  ResponseInterface,
  SubmitCodeResponseDataInterface,
} from "../interfaces/api-interface";
import { expect } from "@jest/globals";
import { STATUS_CODE } from "../utils/constants";

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

export const testCompile = async (
  code: string,
  language: string,
  isCompileError: boolean,
  token: string,
) => {
  const res = (await request(app)
    .post(`/api/problems/1/submit`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      code,
      language,
    })) as ResponseInterface<SubmitCodeResponseDataInterface>;

  if (isCompileError) {
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(res.body.name).toBe("COMPILE_ERROR");
    expect(res.body.data.submission.verdict).toBe("COMPILE_ERROR");
    expect(res.body.data.stderr).toBeTruthy();
  } else {
    expect(res.body.name).not.toBe("COMPILE_ERROR");
    expect(res.body.data.submission.verdict).not.toBe("COMPILE_ERROR");
    expect(res.body.data.stderr).not.toBeTruthy();
  }
};
