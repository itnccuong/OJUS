import { Request as RequestExpress } from "express";

import {
  compileService,
  createSubmission,
  executeCodeService,
  findFileById,
  updateSubmissionVerdict,
} from "../services/problem.services/judging.services";
import {
  SuccessResponseInterface,
  ProblemWithUserStatusInterface,
  SubmissionWithResults,
} from "../interfaces/interface";
import {
  addResultsToSubmissions,
  findSubmissionsProblem,
  getUserStatus,
  findAcceptedProblems,
  queryProblemStatus,
  findAcceptedProblemById,
  findProblemById,
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
  Request,
  Middlewares,
} from "tsoa";
import { verifyToken } from "../middlewares/verify-token";
import { downloadTestcase } from "../utils/general";
import { TestcaseInterface } from "../interfaces/code-executor-interface";

@Route("/api/problems") // Base path for submission-related routes
@Tags("Problems") // Group this endpoint under "Submission" in Swagger
export class ProblemController extends Controller {
  @Post("{problem_id}/")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "All testcases passed")
  public async submit(
    @Path() problem_id: number, // Path parameter
    @Body() body: { code: string; language: string }, // Request body
    @Request() req: RequestExpress,
  ): Promise<SuccessResponseInterface<{ submissionId: number }>> {
    const { code, language } = body;
    const userId = req.userId;
    const submission = await createSubmission(
      problem_id,
      userId,
      code,
      language,
    );

    const filename = await compileService(
      code,
      language,
      submission.submissionId,
    );

    await executeCodeService(
      filename,
      language,
      submission.submissionId,
      problem_id,
    );

    await updateSubmissionVerdict(submission.submissionId, "OK", "");
    return {
      data: { submissionId: submission.submissionId },
    };
  }

  @Get("/no-account")
  @SuccessResponse(200, "Successfully fetched all problems")
  public async getAllProblemsNoAccount(): Promise<
    SuccessResponseInterface<{ problems: ProblemWithUserStatusInterface[] }>
  > {
    const problems = await findAcceptedProblems();

    return {
      data: { problems },
    };
  }

  @Get("/with-account")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched all problems with account")
  public async getAllProblemsWithAccount(
    @Request() req: RequestExpress,
  ): Promise<
    SuccessResponseInterface<{ problems: ProblemWithUserStatusInterface[] }>
  > {
    const userId = req.userId;
    const responseData = await queryProblemStatus(userId);
    return {
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
  ): Promise<
    SuccessResponseInterface<{ problem: ProblemWithUserStatusInterface }>
  > {
    const problem = await findAcceptedProblemById(problem_id);
    const resProblem = { ...problem, userStatus: false };
    return {
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
  ): Promise<
    SuccessResponseInterface<{ problem: ProblemWithUserStatusInterface }>
  > {
    const userId = req.userId;
    const problem = await findAcceptedProblemById(problem_id);
    const userStatus = await getUserStatus(userId, problem.problemId);
    const resProblem = { ...problem, userStatus: userStatus.userStatus };
    return {
      data: { problem: resProblem },
    };
  }

  @Get("/{problem_id}/submissions")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched submissions from problem")
  public async getSubmissionsFromProblem(
    @Path() problem_id: number,
    @Request() req: RequestExpress,
  ): Promise<
    SuccessResponseInterface<{ submissions: SubmissionWithResults[] }>
  > {
    const userId = req.userId;
    const submissions = await findSubmissionsProblem(problem_id, userId);
    const submissionsWithResults = await addResultsToSubmissions(submissions);
    return {
      data: { submissions: submissionsWithResults },
    };
  }

  @Get("/{problem_id}/testcases")
  @SuccessResponse(200, "Successfully fetched submissions from problem")
  public async getTestcases(
    @Path() problem_id: number,
  ): Promise<SuccessResponseInterface<{ testcases: TestcaseInterface }>> {
    const problem = await findProblemById(problem_id);
    const file = await findFileById(problem.fileId);
    const fileUrl = file.url;
    const testcases = await downloadTestcase(fileUrl);
    return {
      data: { testcases: testcases },
    };
  }

  //Get all problem with all status 0 1 2
  @Get("/{problem_id}")
  @SuccessResponse(200, "Successfully fetched problem without user data")
  public async getProblem(
    @Path() problem_id: number,
  ): Promise<
    SuccessResponseInterface<{ problem: ProblemWithUserStatusInterface }>
  > {
    const problem = await findProblemById(problem_id);
    const resProblem = { ...problem, userStatus: false };
    return {
      data: { problem: resProblem },
    };
  }
}
