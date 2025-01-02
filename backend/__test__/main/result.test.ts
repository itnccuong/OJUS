import {
  cleanDatabase,
  insertFile,
  insertProblem,
  insertResult,
  insertSubmission,
  insertUser,
} from "../test_utils";
import {
  file1,
  problem1,
  result1,
  result2,
  submission1,
  user,
} from "../test_data";
import request from "supertest";
import { app } from "../../src/app";
import { ResponseInterfaceForTest } from "../../interfaces/interface";
import { Result } from "@prisma/client";
import { STATUS_CODE } from "../../utils/constants";
jest.setTimeout(60000);

beforeAll(async () => {
  await cleanDatabase();
  await insertUser(user);
  await insertFile(file1);
  await insertProblem(problem1);
  await insertSubmission(submission1);
  await insertResult(result1);
  await insertResult(result2);
});

test("Get all results", async () => {
  const res = (await request(app).get(
    `/api/submissions/${submission1.submissionId}/results`,
  )) as ResponseInterfaceForTest<{
    results: Result[];
  }>;
  expect(res.status).toBe(STATUS_CODE.SUCCESS);
  const results = res.body.data.results;
  expect(results.length).toBe(2);
  results.map((result) => {
    expect(result.submissionId).toBe(submission1.submissionId);
  });
});
