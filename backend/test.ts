import { describe, expect, test } from "@jest/globals";
import axios from "axios";
import { getURL } from "./utils/general";
import { STATUS_CODE } from "./utils/constants";

describe("Auth tests", () => {
  test("Login", async () => {
    const { data } = await axios.post(getURL("/api/auth/login"), {
      usernameOrEmail: "hien",
      password: "1",
    });
    expect(data.status).toBe(STATUS_CODE.SUCCESS);
  });
});
