import { describe, expect, test } from "@jest/globals";
import request from "supertest";
import { app } from "../src/app";

interface SuccessResponse<T> {
  status: number;
  body: {
    data: T;
  };
}

interface ErrorResponse<T> {
  status: number;
  body: {
    name: string;
    message: string;
    data: T;
  };
}

interface LoginSuccessData {
  token: string;
}

describe("Auth tests", () => {
  describe("Login", () => {
    test("Correct username and password", async () => {
      const body = {
        usernameOrEmail: "hien",
        password: "1",
      };
      const res = (await request(app)
        .post("/api/auth/login")
        .send(body)) as SuccessResponse<LoginSuccessData>;
      expect(res.status).toBe(200);
    });

    test("Wrong password", async () => {
      const body = {
        usernameOrEmail: "hien",
        password: "2",
      };
      const res = (await request(app)
        .post("/api/auth/login")
        .send(body)) as ErrorResponse<null>;
      expect(res.body.message).toBe("Invalid password");
    });
  });
});

// describe("Submit code", () => {
//   const body = {
//     code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -1;\n}",
//     language: "C++",
//   };
//   test("Correct", async () => {
//     const res = await request(app)
//       .post(`/api/problems/1/submit`)
//       .set("Authorization");
//     console.log(res.body);
//   });
// });
