import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  GetOneSubmissionInterface,
  GetResultsInterface,
  SuccessResponseInterface,
} from "../interfaces/api-interface";

import {
  Body,
  Controller,
  Get,
  Middlewares,
  Path,
  Post,
  Request,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import {
  findResultBySubmissionId,
  findSubmissionById,
} from "../services/submission.services/submission.service";
import {
  findFileById,
  findProblemById,
} from "../services/problem.services/submit.services";
import { downloadTestcase } from "../utils/general";

@Route("/api/submissions") // Base path for authentication-related routes
@Tags("Submission") // Group this endpoint under "Authentication" in Swagger
export class SubmissionController extends Controller {
  @Get("/{submission_id}")
  @SuccessResponse("200", "Get submission successfully")
  public async getSubmission(
    @Path() submission_id: number,
  ): Promise<SuccessResponseInterface<GetOneSubmissionInterface>> {
    const submission = await findSubmissionById(submission_id);
    const results = await findResultBySubmissionId(submission_id);
    // const problem = await findProblemById(submission.problemId);
    // const file = await findFileById(problem.fileId);
    // const fileUrl = file.location;
    // const testcases = await downloadTestcase(fileUrl);

    return {
      data: {
        submission: submission,
        // results: results,
        // testcases: testcases,
        // problem: problem,
      },
    };
  }

  @Get("/{submission_id}/results")
  @SuccessResponse("200", "Get results of submission successfully")
  public async getResults(
    @Path() submission_id: number,
  ): Promise<SuccessResponseInterface<GetResultsInterface>> {
    const results = await findResultBySubmissionId(submission_id);

    return {
      data: {
        results: results,
      },
    };
  }
}
