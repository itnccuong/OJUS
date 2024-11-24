import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  errorResponse,
  formatResponse,
  successResponse,
} from "../utils/formatResponse";

import path from "path";
import {
  codeDirectory,
  compile,
  executeAgainstTestcase,
  languageDetails,
} from "../services/code-executor/executor-utils";
import fs from "fs";
import {
  convertLanguage,
  downloadTestcase,
  findFileById,
  findProblemById,
  getContainerId,
} from "../services/problem.services";
import { STATUS_CODE } from "../utils/constants";
import { UserConfig } from "../interfaces";
import { CustomError } from "../utils/error";

dotenv.config();

const prisma = new PrismaClient();

export interface SubmitRequest extends Request {
  params: {
    problem_id: string;
  };
  body: {
    code: string;
    language: string;
  };
  userId: number;
}

const submit = async (req: SubmitRequest, res: Response) => {
  const problem_id = parseInt(req.params.problem_id);
  const userId = req.userId;
  const { code } = req.body;
  const language = convertLanguage(req.body.language);

  let submission = await prisma.submission.create({
    data: {
      problemId: problem_id,
      userId: userId,
      code: code,
      language: language,
      verdict: "COMPILE_ERROR",
    },
  });

  const problem = await findProblemById(problem_id);

  const file = await findFileById(problem.fileId);
  const fileUrl = file.location;
  const testcase = await downloadTestcase(fileUrl);

  const timeLimit = problem.timeLimit;

  /////////////////////////////////
  // const file = await findFileById(problem!.fileId);
  // const fileUrl = file!.location;
  // const testcase = await downloadTestcase(fileUrl);

  // console.log("testcase", testcase);
  //
  // const timeLimit = problem!.timeLimit;
  ////////////////////////////////
  // const memoryLimit = problem.memoryLimit;

  //Create new file in codeFiles directory from submitted code
  const filename = `${submission.submissionId}.${language}`;
  //If code directory not exist, create it
  if (!fs.existsSync(codeDirectory)) {
    fs.mkdirSync(codeDirectory);
  }
  const filePath = path.join(codeDirectory, filename);
  fs.writeFileSync(filePath, code, { encoding: "utf-8" });

  const container = languageDetails[language].container;
  const containerId = getContainerId(container);

  const compiledId = await compile(containerId, filename, language);
  submission = await prisma.submission.update({
    where: {
      submissionId: submission.submissionId,
    },
    data: {
      verdict: "RUNTIME_ERROR",
    },
  });

  //Used to identify verdict of submission (first 'not ok' verdict in testcases)
  let is_correcting = true;
  const testcaseLength = testcase.input.length;

  for (let index = 0; index < testcaseLength; ++index) {
    const result = await executeAgainstTestcase(
      containerId,
      compiledId,
      languageDetails[language].inputFunction
        ? languageDetails[language].inputFunction(testcase.input[index])
        : testcase.input[index],
      testcase.output[index],
      language,
      (data, type, pid) => {
        // console.log(`[${pid}] ${type}: ${data}`);
      },
      timeLimit,
    );

    if (result.verdict === "OK") {
      submission.numTestPassed += 1;
    } else if (is_correcting) {
      is_correcting = false;
      submission.verdict = result.verdict;
    }

    await prisma.result.create({
      data: {
        submissionId: submission.submissionId,
        testcaseIndex: index,
        output: result.stdout,
        verdict: result.verdict,
        time: 0,
        memory: 0,
      },
    });
  }

  if (submission.numTestPassed === testcaseLength) {
    submission.verdict = "OK";
  }

  submission = await prisma.submission.update({
    where: {
      submissionId: submission.submissionId,
    },
    data: {
      numTestPassed: submission.numTestPassed,
      verdict: submission.verdict,
    },
  });

  const results = await prisma.result.findMany({
    where: {
      submissionId: submission.submissionId,
    },
  });
  if (submission.verdict === "OK") {
    return successResponse(res, {
      submission: submission,
      result: results,
      testcase: testcase,
    });
  }
  if (submission.verdict === "WRONG_ANSWER") {
    throw new CustomError(
      "WRONG_ANSWER",
      "Wrong answer",
      STATUS_CODE.BAD_REQUEST,
      {
        submission: submission,
        result: results,
        testcase: testcase,
      },
    );
  }
  if (submission.verdict === "TIME_LIMIT_EXCEEDED") {
    throw new CustomError(
      "TIME_LIMIT_EXCEEDED",
      "Time limit exceeded!",
      STATUS_CODE.BAD_REQUEST,
      {
        submission: submission,
        result: results,
        testcase: testcase,
      },
    );
  }
};

export { submit };
