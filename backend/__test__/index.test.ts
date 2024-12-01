import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app";
import { STATUS_CODE } from "../utils/constants";
import { initAllDockerContainers } from "../services/code-executor/executor-utils";
import jwt from "jsonwebtoken";

import {
  fileData,
  problemData,
  registerData,
  compileTestCases,
} from "./test_data";
import { cleanDatabase, testCompile } from "./test_utils";
import prisma from "../prisma/client";
import {
  ResponseInterface,
  SubmitCodeResponseDataInterface,
} from "../interfaces/api-interface";

jest.setTimeout(30000);
let fake_token = "";

beforeAll(async () => {
  await initAllDockerContainers();
  await cleanDatabase();

  await prisma.user.create({
    data: registerData,
  });
  await prisma.files.create({
    data: fileData,
  });
  await prisma.problem.create({
    data: problemData,
  });
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
      .send(body)) as ResponseInterface<SubmitCodeResponseDataInterface>;
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
      .send(body)) as ResponseInterface<SubmitCodeResponseDataInterface>;
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
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
      .send(body)) as ResponseInterface<SubmitCodeResponseDataInterface>;
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
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
      .send(body)) as ResponseInterface<SubmitCodeResponseDataInterface>;
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(res.body.name).toBe("TIME_LIMIT_EXCEEDED");
    expect(res.body.data.submission.verdict).toBe("TIME_LIMIT_EXCEEDED");
  });
});

// describe("Authentication tests", () => {
//   describe("Register", () => {
//     test("Correct all fields", async () => {
//       const res = (await request(app)
//         .post("/api/auth/register")
//         .send(registerData)) as SuccessResponse<RegisterSuccessData>;
//       expect(res.status).toBe(STATUS_CODE.CREATED);
//       expect(res.body.data.user.password).not.toBe(registerData.password);
//     });
//   });
//
//   describe("Login", () => {
//     test("Correct username and password", async () => {
//       const body: LoginInterface = {
//         usernameOrEmail: registerData.username,
//         password: registerData.password,
//       };
//       const res = (await request(app)
//         .post("/api/auth/login")
//         .send(body)) as SuccessResponse<LoginSuccessData>;
//       expect(res.status).toBe(200);
//       expect(res.body.data.token).toBeTruthy();
//       //Save token
//       token = res.body.data.token;
//     });
//   });
// });
