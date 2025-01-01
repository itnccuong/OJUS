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
  addUserStatusToProblem,
  findAcceptedProblems,
  findAcceptedProblemById,
  findProblemById,
  addFalseUserStatusToProblems,
  addUserStatusToProblems,
  addFalseUserStatusToProblem,
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
import { sendSubmissionJob } from "../rabbitmq/submissionProducer";
import fs from "fs/promises"; // Ensure you import the promises API from fs

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
    const userId = req.userId!;
  
    // 1) Create a submission record in DB
    const submission = await createSubmission(problem_id, userId, code, language);
  
    // 2) Produce a message to RabbitMQ, letting the consumer do the compile/execute
    await sendSubmissionJob({
      submissionId: submission.submissionId,
      code,
      language,
      problem_id,
    });
  
    // 3) Return a response — the consumer will do the judging asynchronously
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

    const problemsWithUserStatus = addFalseUserStatusToProblems(problems);

    return {
      data: { problems: problemsWithUserStatus },
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
    const problems = await findAcceptedProblems();
    const problemsWithUserStatus = await addUserStatusToProblems(
      problems,
      userId,
    );
    return {
      data: { problems: problemsWithUserStatus },
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
    const problemWithUserStatus = addFalseUserStatusToProblem(problem);
    return {
      data: { problem: problemWithUserStatus },
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
    const userStatus = await addUserStatusToProblem(userId, problem);
    const problemWithUserStatus = {
      ...problem,
      userStatus: userStatus.userStatus,
    };
    return {
      data: { problem: problemWithUserStatus },
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
  @SuccessResponse(200, "Successfully fetched testcases for the problem")
  public async getTestcases(
    @Path() problem_id: number,
  ): Promise<SuccessResponseInterface<{ testcases: TestcaseInterface }>> {
    let downloadedTestDir: string | undefined;

    try {
      const problem = await findProblemById(problem_id);
      const file = await findFileById(problem.fileId);
      const fileUrl = file.url;

      const { testcase: testcases, testDir } = await downloadTestcase(fileUrl);
      downloadedTestDir = testDir; // Assign to outer scope for cleanup

      return {
        data: { testcases },
      };
    } finally {
      if (downloadedTestDir) {
        try {
          await fs.rm(downloadedTestDir, { recursive: true, force: true });
          console.log(`Deleted test directory at ${downloadedTestDir}`);
        } catch (deleteError) {
          console.error(`Failed to delete test directory at ${downloadedTestDir}:`, deleteError);
          // Optionally, emit a warning or log it for further inspection
        }
      }
    }
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
