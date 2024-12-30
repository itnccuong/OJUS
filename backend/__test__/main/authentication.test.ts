import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../../src/app";
import { STATUS_CODE } from "../../utils/constants";

import { user } from "../test_data";
import { ResponseInterfaceForTest } from "../../interfaces/interface";
import prisma from "../../prisma/client";
import jwt from "jsonwebtoken";
import { cleanDatabase, insertUser } from "../test_utils";
import type { User } from "@prisma/client";

jest.setTimeout(60000);

beforeEach(async () => {
  await cleanDatabase();
  await insertUser(user);
});

describe("Register", () => {
  test("Correct all fields", async () => {
    const body = {
      email: "hienvuongnhat@gmail.com2",
      password: "2",
      fullname: "Hien2",
      username: "hien2",
    };
    const res = (await request(app)
      .post("/api/auth/register")
      .send(body)) as ResponseInterfaceForTest<{ user: User }>;

    expect(res.status).toBe(STATUS_CODE.CREATED);
    expect(res.body.data.user.password).not.toBe(body.password);

    const user = await prisma.user.findFirst({
      where: {
        userId: res.body.data.user.userId,
      },
    });

    expect(user).toBeTruthy();
    if (user) {
      expect(user.email).toBe(body.email);
      expect(user.fullname).toBe(body.fullname);
    }
  });
});

const loginTest = async (body: {
  usernameOrEmail: string;
  password: string;
}) => {
  const res = (await request(app)
    .post("/api/auth/login")
    .send(body)) as ResponseInterfaceForTest<{
    user: User;
    token: string;
  }>;
  expect(res.status).toBe(STATUS_CODE.SUCCESS);
  const token = res.body.data.token;

  expect(token).toBeTruthy();
  let userId = 0;
  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    userId = (decoded as { userId: number }).userId;
  });
  const user = await prisma.user.findFirst({
    where: {
      userId: userId,
    },
  });
  expect(user).toBeTruthy();
  if (user) {
    expect(
      body.usernameOrEmail === user.username ||
        body.usernameOrEmail === user.email,
    ).toBeTruthy();
  }
};

describe("Login", () => {
  test("Correct username and password", async () => {
    const body = {
      usernameOrEmail: "hien",
      password: "1",
    };
    await loginTest(body);
  });

  test("Correct email and password", async () => {
    const body = {
      usernameOrEmail: "hienvuongnhat@gmail.com",
      password: "1",
    };
    await loginTest(body);
  });
});
