import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app";
import { STATUS_CODE } from "../utils/constants";

import { loginData, registerData } from "./test_data";
import {
  LoginResponseInterface,
  RegisterResponseInterface,
  ResponseInterfaceForTest,
  SuccessResponseInterface,
} from "../interfaces/api-interface";
import prisma from "../prisma/client";
import jwt from "jsonwebtoken";

describe("Authentication tests", () => {
  describe("Register", () => {
    test("Correct all fields", async () => {
      const res = (await request(app)
        .post("/api/auth/register")
        .send(registerData)) as ResponseInterfaceForTest<
        SuccessResponseInterface<RegisterResponseInterface>
      >;
      expect(res.status).toBe(STATUS_CODE.CREATED);
      expect(res.body.data.user.password).not.toBe(registerData.password);
      const user = await prisma.user.findFirst({
        where: { username: registerData.username },
      });
      expect(user).toBeTruthy();
      if (user) {
        expect(user.email).toBe(registerData.email);
        expect(user.fullname).toBe(registerData.fullname);
      }
    });
  });

  describe("Login", () => {
    test("Correct username and password", async () => {
      const res = (await request(app)
        .post("/api/auth/login")
        .send(loginData)) as ResponseInterfaceForTest<
        SuccessResponseInterface<LoginResponseInterface>
      >;
      expect(res.status).toBe(STATUS_CODE.SUCCESS);
      const token = res.body.data.token;

      expect(token).toBeTruthy();
      let userId = 0;
      jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
        userId = (decoded as { userId: number }).userId;
      });
      expect(userId).toBeTruthy();

      const user = await prisma.user.findFirst({ where: { userId: userId } });
      expect(user).toBeTruthy();
      if (user) {
        expect(
          user.username === loginData.usernameOrEmail ||
            user.email === loginData.usernameOrEmail,
        ).toBeTruthy();
      }
    });
  });
});
