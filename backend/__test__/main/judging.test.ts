import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../../src/app";
import { STATUS_CODE } from "../../utils/constants";
import { initAllDockerContainers } from "../../services/problem.services/code-executor/executor-utils";
import jwt from "jsonwebtoken";

import { compileFailAnswer, correctAnswers } from "../test_data";
import {
  ErrorResponseInterface,
  FailTestResponseInterface,
  ResponseInterfaceForTest,
  SubmitCodeResponseInterface,
  SuccessResponseInterface,
} from "../../interfaces/api-interface";
import { testCompile, testCorrect } from "../test_services";
import { cleanDatabase } from "../test_utils";
import util from "node:util";
import { exec } from "child_process";

jest.setTimeout(60000);
let fake_token = "";

const execPromise = util.promisify(exec);
beforeAll(async () => {
  await initAllDockerContainers();
  await cleanDatabase();
  await execPromise("ts-node prisma/seed.ts");
  fake_token = jwt.sign(
    { userId: 1 }, // Payload
    process.env.JWT_SECRET as string, // Secret
    { expiresIn: "3m" }, // Token expiration
  );
});

describe("Compile code", () => {
  describe("Compile fail", () => {
    compileFailAnswer.forEach(({ language, invalidCode }) => {
      test(`${language} - Compile Error`, async () => {
        await testCompile(invalidCode, language, true, fake_token);
      });
    });
  });

  describe("Compile success", () => {
    compileFailAnswer.forEach(({ language, validCode }) => {
      test(`${language} - Successful Compilation`, async () => {
        await testCompile(validCode, language, false, fake_token);
      });
    });
  });
});

describe("Correct answer code", () => {
  correctAnswers.forEach(({ language, code }) => {
    test(`${language} - Correct answer`, async () => {
      await testCorrect(code, language, fake_token);
    });
  });
});

describe("Submit code (C++)", () => {
  test("Wrong answer", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -1;\n}",
      language: "cpp",
    };

    const res = (await request(app)
      .post(`/api/problems/1`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ResponseInterfaceForTest<
      ErrorResponseInterface<FailTestResponseInterface>
    >;
    expect(res.status).toBe(STATUS_CODE.UNPROCESSABLE_ENTITY);
    expect(res.body.name).toBe("WRONG_ANSWER");
    expect(res.body.data.submission.verdict).toBe("WRONG_ANSWER");
    const results = res.body.data.results;
    expect(results.length).toBe(2);
    expect(results[0].verdict).toBe("OK");
    expect(results[1].verdict).toBe("WRONG_ANSWER");
  });

  test("Runtime Error", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2/0;\n}",
      language: "cpp",
    };

    const res = (await request(app)
      .post(`/api/problems/1`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ResponseInterfaceForTest<
      ErrorResponseInterface<FailTestResponseInterface>
    >;
    expect(res.status).toBe(STATUS_CODE.UNPROCESSABLE_ENTITY);
    expect(res.body.name).toBe("RUNTIME_ERROR");
    expect(res.body.data.submission.verdict).toBe("RUNTIME_ERROR");
    const results = res.body.data.results;
    expect(results.length).toBe(1);
    expect(results[0].verdict).toBe("RUNTIME_ERROR");
  });

  test("Time limit exceeded", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2; while(1);\n}",
      language: "cpp",
    };

    const res = (await request(app)
      .post(`/api/problems/1`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ResponseInterfaceForTest<
      ErrorResponseInterface<FailTestResponseInterface>
    >;
    expect(res.status).toBe(STATUS_CODE.UNPROCESSABLE_ENTITY);
    expect(res.body.name).toBe("TIME_LIMIT_EXCEEDED");
    expect(res.body.data.submission.verdict).toBe("TIME_LIMIT_EXCEEDED");
    const results = res.body.data.results;
    expect(results.length).toBe(1);
    expect(results[0].verdict).toBe("TIME_LIMIT_EXCEEDED");
  });
});
