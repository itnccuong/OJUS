import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app";
import { STATUS_CODE } from "../utils/constants";
import { initAllDockerContainers } from "../services/code-executor/executor-utils";
import jwt from "jsonwebtoken";

import { compileTestCases } from "./test_data";
import { cleanDatabase, testCompile } from "./test_utils";
import prisma from "../prisma/client";
import {
  ErrorResponseInterface,
  FailTestResponseInterface,
  ResponseInterfaceForTest,
  SubmitCodeResponseInterface,
  SuccessResponseInterface,
} from "../interfaces/api-interface";
import * as util from "node:util";
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

afterAll(async () => {
  // await cleanDatabase();
  await prisma.$disconnect();
});

describe("Compile code", () => {
  describe("Compile fail", () => {
    compileTestCases.forEach(({ language, invalidCode }) => {
      test(`${language} - Compile Error`, async () => {
        await testCompile(invalidCode, language, true, fake_token);
      });
    });
  });

  describe("Compile success", () => {
    compileTestCases.forEach(({ language, validCode }) => {
      test(`${language} - Successful Compilation`, async () => {
        await testCompile(validCode, language, false, fake_token);
      });
    });
  });
});

describe("Submit code (C++)", () => {
  test("Correct answer", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -i;\n}",
      language: "cpp",
    };

    const res = (await request(app)
      .post(`/api/problems/1`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ResponseInterfaceForTest<
      SuccessResponseInterface<SubmitCodeResponseInterface>
    >;
    expect(res.status).toBe(STATUS_CODE.SUCCESS);
    expect(res.body.data.submission.verdict).toBe("OK");
  });

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
  });
});
