import dotenv from "dotenv";
import { Request, Response } from "express";
import { formatResponse, formatResponseNew } from "../utils/formatResponse";

import {
  compile,
  executeAgainstTestcase,
  languageDetails,
} from "../services/code-executor/executor-utils";
import {
  createResult,
  createSubmission,
  downloadTestcase,
  findFileById,
  findProblemById,
  saveCodeToFile,
  updateSubmissionVerdict,
  updateUserProblemStatus,
} from "../services/problem.services/submit.services";
import { STATUS_CODE } from "../utils/constants";
import {
  CustomRequest,
  SubmitCodeConfig,
  ProblemParamsInterface,
} from "../interfaces/api-interface";
import {
  getUserStatus,
  queryProblems,
  queryProblemStatus,
} from "../services/problem.services/problem.service";

dotenv.config();

export const submit = async (
  req: CustomRequest<SubmitCodeConfig, ProblemParamsInterface>,
  res: Response,
) => {
  const problem_id = parseInt(req.params.problem_id);
  const userId = req.userId;
  const { code, language } = req.body;
  // const language = convertLanguage(req.body.language);

  let submission = await createSubmission(problem_id, userId, code, language);
  const problem = await findProblemById(problem_id);
  const file = await findFileById(problem.fileId);

  const fileUrl = file.location;
  const testcase = await downloadTestcase(fileUrl);

  let filename = saveCodeToFile(submission.submissionId, code, language);

  const compileResult = await compile(filename, language);
  if (compileResult.stderr) {
    submission = await updateSubmissionVerdict(
      submission.submissionId,
      "COMPILE_ERROR",
    );

    return formatResponseNew(
      res,
      "COMPILE_ERROR",
      "Compile error",
      STATUS_CODE.BAD_REQUEST,
      {
        submission: submission,
        stderr: compileResult.stderr,
      },
    );
  }
  filename = compileResult.filenameWithoutExtension;

  const testcaseLength = testcase.input.length;
  const timeLimit = problem.timeLimit;

  for (let index = 0; index < testcaseLength; ++index) {
    const result = await executeAgainstTestcase(
      filename,
      languageDetails[language].inputFunction
        ? languageDetails[language].inputFunction(testcase.input[index])
        : testcase.input[index],
      testcase.output[index],
      language,
      timeLimit,
    );

    await createResult(
      submission.submissionId,
      index,
      result.stdout,
      result.verdict,
      0,
      0,
    );

    if (result.verdict !== "OK") {
      submission = await updateSubmissionVerdict(
        submission.submissionId,
        result.verdict,
      );
      return formatResponseNew(
        res,
        result.verdict,
        result.verdict,
        STATUS_CODE.BAD_REQUEST,
        {
          submission: submission,
        },
      );
    }
  }

  submission = await updateSubmissionVerdict(submission.submissionId, "OK");

  // const results = await prisma.result.findMany({
  //   where: {
  //     submissionId: submission.submissionId,
  //   },
  // });
  await updateUserProblemStatus(userId, problem_id);
  return formatResponseNew(
    res,
    "ALL_TEST_PASSED",
    "All testcases passed",
    STATUS_CODE.SUCCESS,
    {
      submission: submission,
    },
  );
};

export const getAllProblemsNoAccount = async (req: Request, res: Response) => {
  const problems = await queryProblems();

  return formatResponseNew(
    res,
    "SUCCESS",
    "Get all problems successfully",
    STATUS_CODE.SUCCESS,
    { problems: problems },
  );
};

export const getAllProblemsWithAccount = async (
  req: Request,
  res: Response,
) => {
  const userId = req.userId;
  //Join userProblemStatus with problem to get status of each problem
  const responseData = await queryProblemStatus(userId);
  return formatResponseNew(
    res,
    "SUCCESS",
    "Get all problems successfully",
    STATUS_CODE.SUCCESS,
    { problems: responseData },
  );
};

export const getOneProblemNoAccount = async (
  req: CustomRequest<null, ProblemParamsInterface>,
  res: Response,
) => {
  const problem_id = parseInt(req.params.problem_id);

  const problem = await findProblemById(problem_id);
  const resProblem = { ...problem, userStatus: false };

  return formatResponseNew(
    res,
    "SUCCESS",
    "Problem fetch successfully!",
    STATUS_CODE.SUCCESS,
    { problem: resProblem },
  );
};

export const getOneProblemWithAccount = async (
  req: CustomRequest<null, ProblemParamsInterface>,
  res: Response,
) => {
  const problem_id = parseInt(req.params.problem_id);
  const userId = req.userId;
  const problem = await findProblemById(problem_id);
  const userStatus = await getUserStatus(userId, problem.problemId);
  const resProblem = { ...problem, userStatus: userStatus.userStatus };

  return formatResponseNew(
    res,
    "SUCCESS",
    "Problem fetch successfully!",
    STATUS_CODE.SUCCESS,
    { problem: resProblem },
  );
};
