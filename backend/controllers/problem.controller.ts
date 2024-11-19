import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { formatResponse } from "../utils/formatResponse";

import { UserConfig } from "../interfaces/user-interface";
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
  findProblemById,
  findTestsByProblemId,
  getContainerId,
} from "../services/problem.services";
import { STATUS_CODE } from "../utils/constants";

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
  user?: UserConfig;
}

const submit = async (req: SubmitRequest, res: Response) => {
  const problem_id = parseInt(req.params.problem_id);
  const user = req.user;
  const { code } = req.body;
  // const language = extensionMap[req.body.language];
  const language = convertLanguage(req.body.language);

  let submission = await prisma.submission.create({
    data: {
      problemId: problem_id,
      userId: user!.userId,
      code: code,
      language: language,
      verdict: "COMPILE_ERROR",
    },
  });

  const testcases = await findTestsByProblemId(problem_id);

  const problem = await findProblemById(problem_id);

  const timeLimit = problem.timeLimit;
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

  for (let index = 0; index < testcases.length; ++index) {
    const result = await executeAgainstTestcase(
      containerId,
      compiledId,
      languageDetails[language].inputFunction
        ? languageDetails[language].inputFunction(testcases[index].input)
        : testcases[index].input,
      testcases[index].output,
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
        testcaseId: testcases[index].testcaseId,
        output: result.stdout,
        verdict: result.verdict,
        time: 0,
        memory: 0,
      },
    });
  }

  if (submission.numTestPassed === testcases.length) {
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
    return formatResponse(
      res,
      {
        submission: submission,
        result: results,
        testcases: testcases,
      },
      STATUS_CODE.SUCCESS,
      "All testcases passed!",
    );
  }
  return formatResponse(
    res,
    {
      submission: submission,
      result: results,
      testcases: testcases,
    },
    STATUS_CODE.BAD_REQUEST,
    `${submission.verdict}, ${submission.numTestPassed}/${testcases.length} testcases passed`,
  );
};

export { submit };
