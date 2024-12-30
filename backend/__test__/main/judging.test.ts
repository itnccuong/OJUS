import { describe, expect, test } from "@jest/globals";
import { initAllDockerContainers } from "../../utils/codeExecutorUtils";

import {
  compileFailAnswer,
  correctAnswers,
  fake_token,
  file1,
  problem1,
  user,
} from "../test_data";
import { testCompile, testCorrect } from "../test_services";
import {
  cleanDatabase,
  getSubmitCodeResults,
  insertFile,
  insertProblem,
  insertUser,
} from "../test_utils";
import { STATUS_CODE } from "../../utils/constants";

jest.setTimeout(60000);

beforeAll(async () => {
  await initAllDockerContainers();
});

beforeEach(async () => {
  await cleanDatabase();
  await insertUser(user);
  await insertFile(file1);
  await insertProblem(problem1);
});

describe("Compile code", () => {
  describe("Compile fail", () => {
    compileFailAnswer.forEach(({ language, invalidCode }) => {
      test(`${language} - Compile Error`, async () => {
        await testCompile(problem1, invalidCode, language, true, fake_token);
      });
    });
  });

  describe("Compile success", () => {
    compileFailAnswer.forEach(({ language, validCode }) => {
      test(`${language} - Successful Compilation`, async () => {
        await testCompile(problem1, validCode, language, false, fake_token);
      });
    });
  });
});

describe("Correct answer code", () => {
  correctAnswers.forEach(({ language, code }) => {
    test(`${language} - Correct answer`, async () => {
      await testCorrect(problem1, code, language, fake_token);
    });
  });
});

// describe("Submit code (C++)", () => {
//   test("Wrong answer", async () => {
//     const body = {
//       code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -1;\n}",
//       language: "cpp",
//     };
//     const { submitCodeResponse, getSubmissionResponse, getResultResponse } =
//       await getSubmitCodeResults(
//         problem1.problemId,
//         body.code,
//         body.language,
//         fake_token,
//       );
//
//     expect(submitCodeResponse.status).toBe(STATUS_CODE.BAD_REQUEST);
//
//     expect(getSubmissionResponse.body.data.submission.problemId).toBe(
//       problem1.problemId,
//     );
//   });
//
//   test("Runtime Error", async () => {
//     const body = {
//       code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2/0;\n}",
//       language: "cpp",
//     };
//
//     const res = await request(app)
//       .post(`/api/problems/1`)
//       .set("Authorization", `Bearer ${fake_token}`)
//       .send(body);
//     expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
//   });
//
//   test("Time limit exceeded", async () => {
//     const body = {
//       code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2; while(1);\n}",
//       language: "cpp",
//     };
//
//     const res = await request(app)
//       .post(`/api/problems/1`)
//       .set("Authorization", `Bearer ${fake_token}`)
//       .send(body);
//     expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
//   });
// });
