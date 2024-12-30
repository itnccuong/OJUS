import {
  cleanDatabase,
  insertFile,
  insertProblem,
  insertSubmission,
  insertUser,
} from "../test_utils";
import {
  file1,
  file2,
  problem1,
  problem2,
  submission1,
  submission2,
  submission3,
  user,
  userToken,
} from "../test_data";
import request from "supertest";
import { app } from "../../src/app";
import {
  ResponseInterfaceForTest,
  SubmissionWithProblem,
  SubmissionWithResults,
} from "../../interfaces/interface";
import { STATUS_CODE, verdict } from "../../utils/constants";

jest.setTimeout(60000);

beforeAll(async () => {
  await cleanDatabase();
  await insertUser(user);
  await insertFile(file1);
  await insertFile(file2);
  await insertProblem(problem1);
  await insertProblem(problem2);
  await insertSubmission(submission1);
  await insertSubmission(submission2);
  await insertSubmission(submission3);
});

test("Get submissions from problem", async () => {
  const res = (await request(app)
    .get(`/api/problems/${problem1.problemId}/submissions`)
    .set("Authorization", `Bearer ${userToken}`)) as ResponseInterfaceForTest<{
    submissions: SubmissionWithResults[];
  }>;
  expect(res.status).toBe(STATUS_CODE.SUCCESS);
  const submissions = res.body.data.submissions;
  expect(submissions.length).toBe(2);
  submissions.map((submission) => {
    expect(submission.problemId).toBe(problem1.problemId);
    expect(submission.userId).toBe(user.userId);
  });
});

test("Get AC submissions", async () => {
  const res = (await request(app).get(
    `/api/user/${user.userId}/submissions/AC`,
  )) as ResponseInterfaceForTest<{
    submissions: SubmissionWithProblem[];
  }>;
  expect(res.status).toBe(STATUS_CODE.SUCCESS);
  const submissions = res.body.data.submissions;
  expect(submissions.length).toBe(2);
  submissions.map((submission) => {
    expect(submission.verdict).toBe(verdict.OK);
    expect(submission.userId).toBe(user.userId);
  });
});
