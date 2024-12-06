import request from "supertest";
import { app } from "../src/app";
import {
  CompileErrorResponseInterface,
  ErrorResponseInterface,
  ResponseInterfaceForTest,
  SubmitCodeResponseInterface,
  SuccessResponseInterface,
} from "../interfaces/api-interface";
import { expect } from "@jest/globals";
import { STATUS_CODE } from "../utils/constants";

export const testCompile = async (
  code: string,
  language: string,
  isCompileError: boolean,
  token: string,
) => {
  const res = (await request(app)
    .post(`/api/problems/1`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      code,
      language,
    })) as ResponseInterfaceForTest<
    ErrorResponseInterface<CompileErrorResponseInterface>
  >;

  if (isCompileError) {
    expect(res.status).toBe(STATUS_CODE.BAD_REQUEST);
    expect(res.body.name).toBe("COMPILE_ERROR");
    expect(res.body.data.submission.verdict).toBe("COMPILE_ERROR");
    expect(res.body.data.stderr).toBeTruthy();
  } else {
    expect(res.body.name).not.toBe("COMPILE_ERROR");
    expect(res.body.data.submission.verdict).not.toBe("COMPILE_ERROR");
  }
};

export const testCorrect = async (
  code: string,
  language: string,
  token: string,
) => {
  const res = (await request(app)
    .post(`/api/problems/1`)
    .set("Authorization", `Bearer ${token}`)
    .send({
      code,
      language,
    })) as ResponseInterfaceForTest<
    SuccessResponseInterface<SubmitCodeResponseInterface>
  >;
  expect(res.status).toBe(STATUS_CODE.SUCCESS);
  expect(res.body.data.submission.verdict).toBe("OK");
  const results = res.body.data.results;
  const testcases = res.body.data.testcases;
  expect(results.length).toBe(testcases.input.length);
  results.map((result, index: number) => {
    expect(result.output).toBe(testcases.output[index]);
    expect(result.verdict).toBe("OK");
  });
};
