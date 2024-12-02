import dotenv from "dotenv";
import { Request as RequestEx, Response } from "express";
import { formatResponse } from "../utils/formatResponse";

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
  SubmitCodeResponseInterface,
  FailTestResponseInterface,
  CompileErrorResponseInterface,
} from "../interfaces/api-interface";
import {
  getUserStatus,
  queryProblems,
  queryProblemStatus,
} from "../services/problem.services/problem.service";

import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  Tags,
  TsoaResponse,
  Res,
  Request,
  Middlewares,
} from "tsoa";
import { verifyToken } from "../middlewares/verify-token";
import prisma from "../prisma/client";

dotenv.config();

@Route("/api/problems") // Base path for submission-related routes
@Tags("Problem") // Group this endpoint under "Submission" in Swagger
export class SubmissionController extends Controller {
  @Post("{problem_id}/")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "All testcases passed")
  public async submit(
    @Path() problem_id: number, // Path parameter
    @Body() body: SubmitCodeConfig, // Request body
    @Request() req: RequestEx,
    @Res()
    CompileErrorResponse: TsoaResponse<400, CompileErrorResponseInterface>,
    @Res() FailTestResponse: TsoaResponse<422, FailTestResponseInterface>,
  ): Promise<SubmitCodeResponseInterface> {
    const { code, language } = body;
    const userId = req.userId;
    // Step 1: Create submission record
    let submission = await createSubmission(problem_id, userId, code, language);
    const problem = await findProblemById(problem_id);
    const file = await findFileById(problem.fileId);
    const fileUrl = file.location;
    // Step 2: Get test cases
    const testcases = await downloadTestcase(fileUrl);

    // Step 3: Save code to a file
    let filename = saveCodeToFile(submission.submissionId, code, language);

    // Step 4: Compile code
    const compileResult = await compile(filename, language);
    if (compileResult.stderr) {
      submission = await updateSubmissionVerdict(
        submission.submissionId,
        "COMPILE_ERROR",
      );

      return CompileErrorResponse(400, {
        message: "Compile error",
        name: "COMPILE_ERROR",
        data: {
          stderr: compileResult.stderr,
          submission: submission,
          testcases: testcases,
        },
      });
    }

    // Step 5: Run test cases
    filename = compileResult.filenameWithoutExtension;
    const testcaseLength = testcases.input.length;
    const timeLimit = problem.timeLimit;

    for (let index = 0; index < testcaseLength; ++index) {
      const result = await executeAgainstTestcase(
        filename,
        languageDetails[language].inputFunction
          ? languageDetails[language].inputFunction(testcases.input[index])
          : testcases.input[index],
        testcases.output[index],
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

        //Query all result
        const results = await prisma.result.findMany({
          where: {
            submissionId: submission.submissionId,
          },
        });

        return FailTestResponse(422, {
          message: result.verdict,
          name: result.verdict,
          data: {
            stderr: result.stderr,
            submission: submission,
            results: results,
            testcases: testcases,
          },
        });
      }
    }

    // Step 6: Update final verdict
    submission = await updateSubmissionVerdict(submission.submissionId, "OK");
    await updateUserProblemStatus(userId, problem_id);

    const results = await prisma.result.findMany({
      where: {
        submissionId: submission.submissionId,
      },
    });

    return {
      message: "All testcases passed",
      data: { submission: submission, results: results, testcases: testcases },
    };
  }
}

// export const submit = async (
//   req: CustomRequest<SubmitCodeConfig, ProblemParamsInterface>,
//   res: Response,
// ) => {
//   const problem_id = parseInt(req.params.problem_id);
//   const userId = req.userId;
//   const { code, language } = req.body;
//   // const language = convertLanguage(req.body.language);
//
//   let submission = await createSubmission(problem_id, userId, code, language);
//   const problem = await findProblemById(problem_id);
//   const file = await findFileById(problem.fileId);
//
//   const fileUrl = file.location;
//   const testcase = await downloadTestcase(fileUrl);
//
//   let filename = saveCodeToFile(submission.submissionId, code, language);
//
//   const compileResult = await compile(filename, language);
//   if (compileResult.stderr) {
//     submission = await updateSubmissionVerdict(
//       submission.submissionId,
//       "COMPILE_ERROR",
//     );
//
//     return formatResponse(
//       res,
//       "COMPILE_ERROR",
//       "Compile error",
//       STATUS_CODE.BAD_REQUEST,
//       {
//         submission: submission,
//         stderr: compileResult.stderr,
//       },
//     );
//   }
//   filename = compileResult.filenameWithoutExtension;
//
//   const testcaseLength = testcase.input.length;
//   const timeLimit = problem.timeLimit;
//
//   for (let index = 0; index < testcaseLength; ++index) {
//     const result = await executeAgainstTestcase(
//       filename,
//       languageDetails[language].inputFunction
//         ? languageDetails[language].inputFunction(testcase.input[index])
//         : testcase.input[index],
//       testcase.output[index],
//       language,
//       timeLimit,
//     );
//
//     await createResult(
//       submission.submissionId,
//       index,
//       result.stdout,
//       result.verdict,
//       0,
//       0,
//     );
//
//     if (result.verdict !== "OK") {
//       submission = await updateSubmissionVerdict(
//         submission.submissionId,
//         result.verdict,
//       );
//       return formatResponse(
//         res,
//         result.verdict,
//         result.verdict,
//         STATUS_CODE.BAD_REQUEST,
//         {
//           submission: submission,
//         },
//       );
//     }
//   }
//
//   submission = await updateSubmissionVerdict(submission.submissionId, "OK");
//
//   // const results = await prisma.result.findMany({
//   //   where: {
//   //     submissionId: submission.submissionId,
//   //   },
//   // });
//   await updateUserProblemStatus(userId, problem_id);
//   return formatResponse(
//     res,
//     "ALL_TEST_PASSED",
//     "All testcases passed",
//     STATUS_CODE.SUCCESS,
//     {
//       submission: submission,
//     },
//   );
// };

export const getAllProblemsNoAccount = async (
  req: RequestEx,
  res: Response,
) => {
  const problems = await queryProblems();

  return formatResponse(
    res,
    "SUCCESS",
    "Get all problems successfully",
    STATUS_CODE.SUCCESS,
    { problems: problems },
  );
};

export const getAllProblemsWithAccount = async (
  req: RequestEx,
  res: Response,
) => {
  const userId = req.userId;
  //Join userProblemStatus with problem to get status of each problem
  const responseData = await queryProblemStatus(userId);
  return formatResponse(
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

  return formatResponse(
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

  return formatResponse(
    res,
    "SUCCESS",
    "Problem fetch successfully!",
    STATUS_CODE.SUCCESS,
    { problem: resProblem },
  );
};
