import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app";
import { STATUS_CODE } from "../utils/constants";
import { initAllDockerContainers } from "../services/code-executor/executor-utils";
import jwt from "jsonwebtoken";

import { fileData, problemData, registerData } from "./test_data";
import { cleanDatabase } from "./test_utils";
import prisma from "../prisma/client";
import {
  ErrorResponse,
  SubmitCorrectAnswerData,
  SubmitWrongAnswerData,
} from "../interfaces/api-interface";

let fake_token = "";

beforeAll(async () => {
  await cleanDatabase();

  await prisma.user.create({
    data: registerData,
  });
  await prisma.files.create({
    data: fileData,
  });
  const res = await prisma.problem.create({
    data: problemData,
  });
  fake_token = jwt.sign(
    { userId: 1 }, // Payload
    process.env.JWT_SECRET as string, // Secret
    { expiresIn: "3m" }, // Token expiration
  );
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

describe("Submit code", () => {
  test("Initialize containers", async () => {
    // Spy on console.log
    const consoleSpy = jest.spyOn(console, "log");

    await initAllDockerContainers();
    expect(consoleSpy).toHaveBeenCalledWith("\nAll containers initialized");

    consoleSpy.mockRestore();
  }, 10000);

  test("Correct answer", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -i;\n}",
      language: "C++",
    };

    const res = (await request(app)
      .post(`/api/problems/1/submit`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ErrorResponse<SubmitCorrectAnswerData>;
    expect(res.status).toBe(STATUS_CODE.SUCCESS);
    expect(res.body.data.submission.verdict).toBe("OK");
    expect(res.body.data.submission.numTestPassed).toBe(3);
  });

  test("Wrong answer", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2;\n}",
      language: "C++",
    };

    const res = (await request(app)
      .post(`/api/problems/1/submit`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ErrorResponse<SubmitWrongAnswerData>;
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(res.body.name).toBe("WRONG_ANSWER");
    expect(res.body.data.submission.verdict).toBe("WRONG_ANSWER");
    expect(res.body.data.submission.numTestPassed).toBe(1);
    expect(res.body.data.results[0].verdict).toBe("WRONG_ANSWER");
    expect(res.body.data.results[1].verdict).toBe("OK");
    expect(res.body.data.results[2].verdict).toBe("WRONG_ANSWER");
  });

  test("Compile Error", async () => {
    const body = {
      code: "#include <IOStream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2;\n}",
      language: "C++",
    };

    const res = (await request(app)
      .post(`/api/problems/1/submit`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ErrorResponse<SubmitWrongAnswerData>;
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(res.body.name).toBe("COMPILE_ERROR");
    expect(res.body.data.submission.verdict).toBe("COMPILE_ERROR");
    expect(res.body.data.submission.numTestPassed).toBe(0);
    expect(res.body.data.results[1].verdict).toBe("OK");
  });

  test("Runtime Error", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2/0;\n}",
      language: "C++",
    };

    const res = (await request(app)
      .post(`/api/problems/1/submit`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ErrorResponse<SubmitWrongAnswerData>;
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(res.body.name).toBe("RUNTIME_ERROR");
    expect(res.body.data.submission.verdict).toBe("RUNTIME_ERROR");
    expect(res.body.data.submission.numTestPassed).toBe(0);
    res.body.data.results.map((result) => {
      expect(result.verdict).toBe("RUNTIME_ERROR");
    });
  });

  test("Time limit exceeded", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2; while(1);\n}",
      language: "C++",
    };

    const res = (await request(app)
      .post(`/api/problems/1/submit`)
      .set("Authorization", `Bearer ${fake_token}`)
      .send(body)) as ErrorResponse<SubmitWrongAnswerData>;
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(res.body.name).toBe("TIME_LIMIT_EXCEEDED");
    expect(res.body.data.submission.verdict).toBe("TIME_LIMIT_EXCEEDED");
    expect(res.body.data.submission.numTestPassed).toBe(0);
    res.body.data.results.map((result) => {
      expect(result.verdict).toBe("TIME_LIMIT_EXCEEDED");
    });
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
