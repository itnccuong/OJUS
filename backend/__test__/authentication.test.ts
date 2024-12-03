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
    });
  });

  describe("Login", () => {
    test("Correct username and password", async () => {
      const res = (await request(app)
        .post("/api/auth/login")
        .send(loginData)) as ResponseInterfaceForTest<
        SuccessResponseInterface<LoginResponseInterface>
      >;
      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeTruthy();
    });
  });
});
