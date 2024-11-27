import dotenv from "dotenv";
import { Response } from "express";
import { errorResponse, successResponse } from "../utils/formatResponse";

import {
  compile,
  executeAgainstTestcase,
  languageDetails,
} from "../services/code-executor/executor-utils";
import {
  convertLanguage,
  createResult,
  createSubmission,
  downloadTestcase,
  findFileById,
  findProblemById,
  saveCodeToFile,
  updateSubmissionVerdict,
} from "../services/problem.services/submit.services";
import { STATUS_CODE } from "../utils/constants";
import {
  CustomRequest,
  SubmitCodeConfig,
  SubmitParamsConfig,
} from "../interfaces/api-interface";

dotenv.config();

const submit = async (
  req: CustomRequest<SubmitCodeConfig, SubmitParamsConfig>,
  res: Response,
) => {
  const problem_id = parseInt(req.params.problem_id);
  const userId = req.userId;
  const { code } = req.body;
  const language = convertLanguage(req.body.language);

  let submission = await createSubmission(problem_id, userId, code, language);
  const problem = await findProblemById(problem_id);
  const file = await findFileById(problem.fileId);

  const fileUrl = file.location;
  const testcase = await downloadTestcase(fileUrl);

  const filenameWithExtension = saveCodeToFile(
    submission.submissionId,
    code,
    language,
  );

  const filename = await compile(filenameWithExtension, language);
  if (!filename) {
    submission = await updateSubmissionVerdict(
      submission.submissionId,
      "COMPILE_ERROR",
    );

    return errorResponse(
      res,
      "COMPILE_ERROR",
      "Compile error",
      STATUS_CODE.BAD_REQUEST,
      {
        submission: submission,
      },
    );
  }
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
      return errorResponse(
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
  return successResponse(
    res,
    {
      submission: submission,
    },
    STATUS_CODE.SUCCESS,
  );
};

export { submit };
