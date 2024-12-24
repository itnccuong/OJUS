import { SuccessResponseInterface } from "../interfaces/interface";

import { Controller, Get, Path, Route, SuccessResponse, Tags } from "tsoa";
import {
  findResultBySubmissionId,
  findSubmissionById,
} from "../services/submission.services/submission.service";
import type { Result, Submission } from "@prisma/client";

@Route("/api/submissions") // Base path for authentication-related routes
@Tags("Submission") // Group this endpoint under "Authentication" in Swagger
export class SubmissionController extends Controller {
  @Get("/{submission_id}")
  @SuccessResponse("200", "Get submission successfully")
  public async getSubmission(
    @Path() submission_id: number,
  ): Promise<SuccessResponseInterface<{ submission: Submission }>> {
    const submission = await findSubmissionById(submission_id);
    return {
      data: {
        submission: submission,
      },
    };
  }

  @Get("/{submission_id}/results")
  @SuccessResponse("200", "Get results of submission successfully")
  public async getResults(
    @Path() submission_id: number,
  ): Promise<SuccessResponseInterface<{ results: Result[] }>> {
    const results = await findResultBySubmissionId(submission_id);

    return {
      data: {
        results: results,
      },
    };
  }
}
