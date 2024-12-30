import { beforeEach, describe, expect, test } from "@jest/globals";
import { app } from "../../src/app";
import request from "supertest";
import path from "path";
import {
  ProblemWithUserStatusInterface,
  ResponseInterfaceForTest,
} from "../../interfaces/interface";
import prisma from "../../prisma/client";
import {
  cleanDatabase,
  insertFile,
  insertProblem,
  insertUser,
} from "../test_utils";
import {
  userToken,
  user,
  contribution1,
  contribution2,
  file3,
  file4,
  adminToken,
  admin,
} from "../test_data";
import { Problem } from "@prisma/client";
import { deleteFile } from "../../utils/fileUtilsDO";
import { STATUS_CODE } from "../../utils/constants";
import axios from "axios";

const filePath = path.resolve(__dirname, "../../testcaseForTest/testcase.zip");

jest.setTimeout(60000);

beforeEach(async () => {
  await cleanDatabase();
  await insertUser(user);
  await insertFile(file3);
  await insertProblem(contribution1);
});

test("Contribute", async () => {
  const res = (await request(app)
    .post("/api/contributions")
    .set("Authorization", `Bearer ${userToken}`)
    .field("title", "Contribution Title")
    .field("description", "Contribution Description")
    .field("difficulty", "2")
    .field("tags", "ok")
    .field("timeLimit", "1000")
    .field("memoryLimit", "1000")
    .attach("file", filePath)
    .set("Content-Type", "multipart/form-data")) as ResponseInterfaceForTest<{
    contribution: Problem;
  }>;
  expect(res.status).toBe(STATUS_CODE.CREATED);
  const contribution = await prisma.problem.findFirst({
    where: { problemId: res.body.data.contribution.problemId },
  });
  expect(contribution).toBeTruthy();
  if (contribution) {
    expect(contribution.title).toBe("Contribution Title");
    expect(res.body.data.contribution.status).toBe(0);
    expect(res.body.data.contribution.authorId).toBe(user.userId);
  }

  const file = await prisma.files.findFirst({
    where: { fileId: contribution?.fileId },
  });
  expect(file).toBeTruthy();
  if (file) {
    expect(file.fileType).toContain("zip");
    expect(file.url).toBeTruthy();
    const requestFileUrl = await axios.get(file.url);
    expect(requestFileUrl.status).toBe(STATUS_CODE.SUCCESS);
    expect(file.key).toBeTruthy();
    await deleteFile(file.key as string);
  }
});

describe("Using admin account", () => {
  beforeEach(async () => {
    await insertUser(admin);
  });
  test("Get all contributions", async () => {
    await insertFile(file4);
    await insertProblem(contribution2);

    const res = (await request(app)
      .get("/api/contributions")
      .set(
        "Authorization",
        `Bearer ${adminToken}`,
      )) as ResponseInterfaceForTest<{
      contributions: Problem[];
    }>;
    expect(res.status).toBe(STATUS_CODE.SUCCESS);
    const contributions = res.body.data.contributions;
    expect(contributions.length).toBe(2);
    contributions.map((contribution) => {
      expect(contribution.status).toBe(0);
    });
  });

  test("Get one contribution", async () => {
    const res = (await request(app)
      .get(`/api/contributions/${contribution1.problemId}`)
      .set(
        "Authorization",
        `Bearer ${adminToken}`,
      )) as ResponseInterfaceForTest<{
      contribution: Problem;
    }>;
    const contribution = res.body.data.contribution;
    expect(res.status).toBe(STATUS_CODE.SUCCESS);
    expect(contribution.problemId).toBe(contribution1.problemId);
    expect(contribution.status).toBe(0);
  });

  test("Accept a contribution", async () => {
    const res = (await request(app)
      .patch(`/api/contributions/${contribution1.problemId}/accept`)
      .set(
        "Authorization",
        `Bearer ${adminToken}`,
      )) as ResponseInterfaceForTest<{ contribution: Problem }>;

    const problemId = res.body.data.contribution.problemId;

    expect(res.status).toBe(STATUS_CODE.SUCCESS);
    expect(problemId).toBe(contribution1.problemId);
    // Verify the contribution status is updated
    const acceptedProblem = (await request(app).get(
      `/api/problems/${problemId}`,
    )) as ResponseInterfaceForTest<{
      problem: ProblemWithUserStatusInterface;
    }>;
    const problem = acceptedProblem.body.data.problem;
    expect(problem.status).toBe(2);
  });

  test("Reject a contribution", async () => {
    const res = (await request(app)
      .patch(`/api/contributions/${contribution1.problemId}/reject`)
      .set(
        "Authorization",
        `Bearer ${adminToken}`,
      )) as ResponseInterfaceForTest<{ contribution: Problem }>;

    const problemId = res.body.data.contribution.problemId;

    expect(res.status).toBe(STATUS_CODE.SUCCESS);
    expect(problemId).toBe(contribution1.problemId);
    // Verify the contribution status is updated
    const acceptedProblem = (await request(app).get(
      `/api/problems/${problemId}`,
    )) as ResponseInterfaceForTest<{
      problem: ProblemWithUserStatusInterface;
    }>;
    const problem = acceptedProblem.body.data.problem;
    expect(problem.status).toBe(1);
  });
});

describe("Using user account", () => {
  test("Get all contributions", async () => {
    const res = (await request(app)
      .get("/api/contributions")
      .set(
        "Authorization",
        `Bearer ${userToken}`,
      )) as ResponseInterfaceForTest<{
      contributions: Problem[];
    }>;
    expect(res.status).toBe(STATUS_CODE.FORBIDDEN);
  });

  test("Get one contribution", async () => {
    const res = (await request(app)
      .get(`/api/contributions/${contribution1.problemId}`)
      .set(
        "Authorization",
        `Bearer ${userToken}`,
      )) as ResponseInterfaceForTest<{
      contribution: Problem;
    }>;
    expect(res.status).toBe(STATUS_CODE.FORBIDDEN);
  });

  test("Accept a contribution", async () => {
    const res = (await request(app)
      .patch(`/api/contributions/${contribution1.problemId}/accept`)
      .set(
        "Authorization",
        `Bearer ${userToken}`,
      )) as ResponseInterfaceForTest<{ contribution: Problem }>;

    expect(res.status).toBe(STATUS_CODE.FORBIDDEN);
  });

  test("Reject a contribution", async () => {
    const res = (await request(app)
      .patch(`/api/contributions/${contribution1.problemId}/reject`)
      .set(
        "Authorization",
        `Bearer ${userToken}`,
      )) as ResponseInterfaceForTest<{ contribution: Problem }>;

    expect(res.status).toBe(STATUS_CODE.FORBIDDEN);
  });
});
