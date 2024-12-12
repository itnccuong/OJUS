import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  GetOneSubmissionInterface,
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
  downloadTestcase,
  findFileById,
  findProblemById,
} from "../services/problem.services/submit.services";

@Route("/api/submissions") // Base path for authentication-related routes
@Tags("Submission") // Group this endpoint under "Authentication" in Swagger
export class SubmissionController extends Controller {
  @SuccessResponse("200", "Get submission successfully")
  @Get("/{submission_id}")
  public async login(
    @Path() submission_id: number,
  ): Promise<SuccessResponseInterface<GetOneSubmissionInterface>> {
    const submission = await findSubmissionById(submission_id);
    const results = await findResultBySubmissionId(submission_id);
    const problem = await findProblemById(submission.problemId);
    const file = await findFileById(problem.fileId);
    const fileUrl = file.location;
    // Step 2: Get test cases
    const testcases = await downloadTestcase(fileUrl);

    return {
      message: "Get submission successfully!",
      data: {
        submission: submission,
        results: results,
        testcases: testcases,
        problem: problem,
      },
    };
  }
}
