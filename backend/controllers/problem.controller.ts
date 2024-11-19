import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { formatResponse } from "../utils/formatResponse";

import { UserConfig } from "../interfaces/user-interface";
import path from "path";
import {
  codeDirectory,
  compile,
  execute,
  languageDetails,
} from "../services/code-executor/executor-utils";
import fs from "fs";
import { findTestsByProblemId } from "../services/database-queries/testcase";
import { STATUS_CODE } from "../utils/constants";
import { convertLanguage } from "../services/general";

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

  //Create a new submission
  const submission = await prisma.submission.create({
    data: {
      problemId: problem_id,
      userId: user!.userId,
      code: code,
      language: language,
      verdict: "COMPILE_ERROR",
    },
  });

  const testcases = await findTestsByProblemId(problem_id);

  const problem = await prisma.problem.findUnique({
    where: {
      problemId: problem_id,
    },
  });

  if (!problem) {
    return formatResponse(res, {}, STATUS_CODE.NOT_FOUND, "Problem not found");
  }
  //Create new file in codeFiles directory from submitted code
  const filename = `${submission.submissionId}.${language}`;
  //If code directory not exist, create it
  if (!fs.existsSync(codeDirectory)) {
    fs.mkdirSync(codeDirectory);
  }
  const filePath = path.join(codeDirectory, filename);
  fs.writeFileSync(filePath, code, { encoding: "utf-8" });

  const containerId = languageDetails[language].container.id;
  if (!containerId) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.BAD_REQUEST,
      "Container not found",
    );
  }

  const compiledId = await compile(containerId, filename, language);
  await prisma.submission.update({
    where: {
      submissionId: submission.submissionId,
    },
    data: {
      verdict: "RUNTIME_ERROR",
    },
  });

  var is_correcting = true;
  for (let index = 0; index < testcases.length; ++index) {
    let verdict = "OK";
    const exOut = await execute(
      containerId,
      compiledId,
      languageDetails[language].inputFunction
        ? languageDetails[language].inputFunction(testcases[index].input)
        : testcases[index].input,
      language,
      (data, type, pid) => {
        // console.log(`[${pid}] ${type}: ${data}`);
      },
    );

    if (
      // time < problem.timeLimit &&
      // memory < problem.memoryLimit &&
      exOut === testcases[index].output
    ) {
      submission.numTestPassed += 1;
    } else {
      verdict = "WRONG_ANSWER";
      if (is_correcting) {
        is_correcting = false;
        submission.verdict = verdict;
      }
    }

    await prisma.result.create({
      data: {
        submissionId: submission.submissionId,
        testcaseId: testcases[index].testcaseId,
        output: exOut,
        verdict: verdict,
        time: 0,
        memory: 0,
      },
    });
  }

  if (submission.numTestPassed === testcases.length) {
    submission.verdict = "OK";
  }

  await prisma.submission.update({
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
    `Wrong answer, ${submission.numTestPassed}/${testcases.length} testcases passed`,
  );
};

export { submit };
