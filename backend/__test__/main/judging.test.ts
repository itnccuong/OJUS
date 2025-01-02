import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import { initAllDockerContainers } from "../../utils/codeExecutorUtils";
import { startSubmissionConsumer } from "../../rabbitmq/submissionConsumer";
import { initRabbitMQ } from "../../rabbitmq/rabbitmqClient";

import {
  compileFailAnswer,
  correctAnswers,
  userToken,
  file1,
  problem1,
  user,
} from "../test_data";
import { testCompile, testCorrect } from "../test_services";
import {
  cleanDatabase,
  getSubmitCodeResults,
  insertFile,
  insertProblem,
  insertUser,
} from "../test_utils";
import { STATUS_CODE, verdict } from "../../utils/constants";

jest.setTimeout(600000);

beforeAll(async () => {
  await initAllDockerContainers();
  await initRabbitMQ();
  startSubmissionConsumer();
});

beforeAll(async () => {
  await cleanDatabase();
  await insertUser(user);
  await insertFile(file1);
  await insertProblem(problem1);
});

describe("Compile code", () => {
  describe("Compile fail", () => {
    compileFailAnswer.forEach(({ language, invalidCode }) => {
      test(`${language} - Compile Error`, async () => {
        await testCompile(problem1, invalidCode, language, true, userToken);
      });
    });
  });

  describe("Compile success", () => {
    compileFailAnswer.forEach(({ language, validCode }) => {
      test(`${language} - Successful Compilation`, async () => {
        await testCompile(problem1, validCode, language, false, userToken);
      });
    });
  });
});

describe("Correct answer code", () => {
  correctAnswers.forEach(({ language, code }) => {
    test(`${language} - Correct answer`, async () => {
      await testCorrect(problem1, code, language, userToken);
    });
  });
});

describe("Submit code (C++)", () => {
  test("Wrong answer", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -1;\n}",
      language: "cpp",
    };
    const { submitCodeResponse, getSubmissionResponse, getResultResponse } =
      await getSubmitCodeResults(
        problem1.problemId,
        body.code,
        body.language,
        userToken,
      );

    expect(submitCodeResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getSubmissionResponse.body.data.submission.verdict).toBe(
      verdict.WRONG_ANSWER,
    );
    expect(getSubmissionResponse.body.data.submission.stderr).toBeFalsy();

    expect(getResultResponse.body.data.results.length).toBeGreaterThan(0);
    const results = getResultResponse.body.data.results;
    results.map((result, index) => {
      if (index !== results.length - 1) {
        expect(result.verdict).toBe(verdict.OK);
      } else {
        expect(result.verdict).toBe(verdict.WRONG_ANSWER);
      }
    });
  });

  test("Runtime Error", async () => {
    const body = {
      code: "#include <iostream>\n\nint main() {\n    int *ptr = nullptr; // Initialize pointer to nullptr\n    std::cout << \"Dereferencing nullptr to cause runtime error.\" << std::endl;\n    std::cout << *ptr << std::endl; // Dereferencing nullptr which will cause a runtime error\n    return 0;\n}\n",
      language: "cpp",
    };

    const { submitCodeResponse, getSubmissionResponse, getResultResponse } =
      await getSubmitCodeResults(
        problem1.problemId,
        body.code,
        body.language,
        userToken,
      );

    expect(submitCodeResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getSubmissionResponse.body.data.submission.verdict).toBe(
      verdict.RUNTIME_ERROR,
    );

    expect(getResultResponse.body.data.results.length).toBeGreaterThan(0);
    const results = getResultResponse.body.data.results;
    results.map((result, index) => {
      if (index !== results.length - 1) {
        expect(result.verdict).toBe(verdict.OK);
      } else {
        expect(result.verdict).toBe(verdict.RUNTIME_ERROR);
      }
    });
  });

  test("Time limit exceeded", async () => {
    const body = {
      code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -2; while(1);\n}",
      language: "cpp",
    };

    const { submitCodeResponse, getSubmissionResponse, getResultResponse } =
      await getSubmitCodeResults(
        problem1.problemId,
        body.code,
        body.language,
        userToken,
      );

    expect(submitCodeResponse.status).toBe(STATUS_CODE.SUCCESS);
    expect(getSubmissionResponse.body.data.submission.verdict).toBe(
      verdict.TIME_LIMIT_EXCEEDED,
    );
    expect(getSubmissionResponse.body.data.submission.stderr).toBeFalsy();

    expect(getResultResponse.body.data.results.length).toBeGreaterThan(0);
    const results = getResultResponse.body.data.results;
    results.map((result, index) => {
      if (index !== results.length - 1) {
        expect(result.verdict).toBe(verdict.OK);
      } else {
        expect(result.verdict).toBe(verdict.TIME_LIMIT_EXCEEDED);
        expect(result.time).toBeGreaterThanOrEqual(problem1.timeLimit);
      }
    });
  });
});
