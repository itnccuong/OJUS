import { Request as RequestExpress } from "express";

import {
  compile,
  executeAgainstTestcase,
} from "../services/problem.services/code-executor/executor-utils";
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
import {
  SubmitCodeConfig,
  SubmitCodeResponseInterface,
  FailTestResponseInterface,
  CompileErrorResponseInterface,
  ErrorResponseInterface,
  SuccessResponseInterface,
  GetAllProblemInterface,
  GetOneProblemInterface,
  GetAllSubmissionsInterface,
} from "../interfaces/api-interface";
import {
  findSubmissionsProblem,
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

@Route("/api/problems") // Base path for submission-related routes
@Tags("Problems") // Group this endpoint under "Submission" in Swagger
export class ProblemController extends Controller {
  @Post("{problem_id}/")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "All testcases passed")
  public async submit(
    @Path() problem_id: number, // Path parameter
    @Body() body: SubmitCodeConfig, // Request body
    @Request() req: RequestExpress,
    @Res()
    CompileErrorResponse: TsoaResponse<
      400,
      ErrorResponseInterface<CompileErrorResponseInterface>
    >,
    @Res()
    FailTestResponse: TsoaResponse<
      422,
      ErrorResponseInterface<FailTestResponseInterface>
    >,
  ): Promise<SuccessResponseInterface<SubmitCodeResponseInterface>> {
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
        testcases.input[index],
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
        result.stderr,
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

  @Get("/no-account")
  @SuccessResponse(200, "Successfully fetched all problems")
  public async getAllProblemsNoAccount(): Promise<
    SuccessResponseInterface<GetAllProblemInterface>
  > {
    const problems = await queryProblems();

    return {
      message: "Get all problems successfully",
      data: { problems },
    };
  }

  @Get("/with-account")
  // @Security("jwt")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched all problems with account")
  public async getAllProblemsWithAccount(
    @Request() req: RequestExpress,
  ): Promise<SuccessResponseInterface<GetAllProblemInterface>> {
    const userId = req.userId;
    const responseData = await queryProblemStatus(userId);
    return {
      message: "Get all problems with account successfully",
      data: { problems: responseData },
    };
  }

  /**
   * Fetch a single problem without user account data.
   */
  @Get("/no-account/{problem_id}")
  @SuccessResponse(200, "Successfully fetched problem without user data")
  public async getOneProblemNoAccount(
    @Path() problem_id: number,
  ): Promise<SuccessResponseInterface<GetOneProblemInterface>> {
    const problem = await findProblemById(problem_id);
    const resProblem = { ...problem, userStatus: false };
    return {
      message: "Problem fetched successfully!",
      data: { problem: resProblem },
    };
  }

  /**
   * Fetch a single problem with user account data (status included).
   */
  @Get("/with-account/{problem_id}")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched problem with user data")
  public async getOneProblemWithAccount(
    @Path() problem_id: number,
    @Request() req: RequestExpress,
  ): Promise<SuccessResponseInterface<GetOneProblemInterface>> {
    const userId = req.userId;
    const problem = await findProblemById(problem_id);
    const userStatus = await getUserStatus(userId, problem.problemId);
    const resProblem = { ...problem, userStatus: userStatus.userStatus };
    return {
      message: "Problem fetched successfully!",
      data: { problem: resProblem },
    };
  }

  @Get("/{problem_id}/submissions")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched submissions from problem")
  public async getSubmissionsFromProblem(
    @Path() problem_id: number,
    @Request() req: RequestExpress,
  ): Promise<SuccessResponseInterface<GetAllSubmissionsInterface>> {
    const userId = req.userId;
    const submissions = await findSubmissionsProblem(problem_id, userId);
    return {
      message: "Problem fetched successfully!",
      data: { submissions: submissions },
    };
  }
}
