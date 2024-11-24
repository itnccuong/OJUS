import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app";
import { STATUS_CODE } from "../utils/constants";
import { PrismaClient } from "@prisma/client";

import {
  LoginInterface,
  LoginSuccessData,
  RegisterConfig,
  RegisterSuccessData,
  SuccessResponse,
} from "../interfaces/api-interface";
import { initAllDockerContainers } from "../services/code-executor/executor-utils";

const prisma = new PrismaClient();

const cleanDatabase = async () => {
  const deleteUser = prisma.user.deleteMany();
  const deleteFile = prisma.files.deleteMany();
  const deleteProblem = prisma.problem.deleteMany();
  const deleteSubmission = prisma.submission.deleteMany();
  const deleteResult = prisma.result.deleteMany();

  await prisma.$transaction([
    deleteUser,
    deleteFile,
    deleteProblem,
    deleteSubmission,
    deleteResult,
  ]);
};

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await prisma.$disconnect();
});

let token = "";

describe("Authentication tests", () => {
  const registerBody: RegisterConfig = {
    email: "hienvuongnhat@gmail.com",
    username: "hien",
    password: "1",
    fullname: "Hien",
  };
  describe("Register", () => {
    test("Correct all fields", async () => {
      const res = (await request(app)
        .post("/api/auth/register")
        .send(registerBody)) as SuccessResponse<RegisterSuccessData>;
      expect(res.status).toBe(STATUS_CODE.CREATED);
      expect(res.body.data.user.password).not.toBe(registerBody.password);
    });
  });

  describe("Login", () => {
    test("Correct username and password", async () => {
      const body: LoginInterface = {
        usernameOrEmail: registerBody.username,
        password: registerBody.password,
      };
      const res = (await request(app)
        .post("/api/auth/login")
        .send(body)) as SuccessResponse<LoginSuccessData>;
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeTruthy();
      //Save token
      token = res.body.data.token;
    });
  });
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

    const res = await request(app)
      .post(`/api/problems/1/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send(body);
    expect(res.status).toBe(STATUS_CODE.SUCCESS);
  });

  test("Wrong answer", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2;\n}",
      language: "C++",
    };

    const res = await request(app)
      .post(`/api/problems/1/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send(body);
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
  });
});
