// import { beforeEach, describe, expect, test } from "@jest/globals";
// import { app } from "../../src/app";
// import request from "supertest";
// import {
//   ProblemWithUserStatusInterface,
//   ResponseInterfaceForTest,
// } from "../../interfaces/interface";
// import {
//   cleanDatabase,
//   insertFile,
//   insertProblem,
//   insertUser,
// } from "../test_utils";
// import {
//   userToken,
//   file1,
//   file2,
//   problem1,
//   problem2,
//   user,
// } from "../test_data";
//
// jest.setTimeout(60000);
//
// beforeEach(async () => {
//   await cleanDatabase();
//   await insertUser(user);
//   await insertFile(file1);
//   await insertProblem(problem1);
// });
//
// describe("Get problem list", () => {
//   beforeEach(async () => {
//     await insertFile(file2);
//     await insertProblem(problem2);
//   });
//   test("No account", async () => {
//     const res = (await request(app).get(
//       "/api/problems/no-account",
//     )) as ResponseInterfaceForTest<{
//       problems: ProblemWithUserStatusInterface[];
//     }>;
//     expect(res.status).toBe(200);
//     const problems = res.body.data.problems;
//     problems.map((problem) => {
//       expect(problem.status).toBe(2);
//     });
//     expect(problems.length).toBe(2);
//   });
//
//   test("with account", async () => {
//     const res = (await request(app)
//       .get("/api/problems/with-account")
//       .set(
//         "Authorization",
//         `Bearer ${userToken}`,
//       )) as ResponseInterfaceForTest<{
//       problems: ProblemWithUserStatusInterface[];
//     }>;
//     expect(res.status).toBe(200);
//     const problems = res.body.data.problems;
//     problems.map((problem) => {
//       expect(problem.status).toBe(2);
//       expect(problem).toHaveProperty("userStatus");
//     });
//     expect(problems.length).toBe(2);
//   });
// });
//
// describe("Get one problem", () => {
//   test("No account", async () => {
//     const res = (await request(app).get(
//       `/api/problems/no-account/${problem1.problemId}`,
//     )) as ResponseInterfaceForTest<{ problem: ProblemWithUserStatusInterface }>;
//     expect(res.status).toBe(200);
//     const problem = res.body.data.problem;
//     expect(problem.problemId).toBe(problem1.problemId);
//     expect(problem.status).toBe(2);
//   });
//
//   test("With account", async () => {
//     const res = (await request(app)
//       .get(`/api/problems/with-account/${problem1.problemId}`)
//       .set(
//         "Authorization",
//         `Bearer ${userToken}`,
//       )) as ResponseInterfaceForTest<{
//       problem: ProblemWithUserStatusInterface;
//     }>;
//     expect(res.status).toBe(200);
//     const problem = res.body.data.problem;
//     expect(problem.problemId).toBe(problem1.problemId);
//     expect(problem.status).toBe(2);
//     expect(problem).toHaveProperty("userStatus");
//   });
// });
