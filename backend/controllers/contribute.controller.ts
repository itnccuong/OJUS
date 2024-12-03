import dotenv from "dotenv";
dotenv.config();

import {
  Request as RequestExpress,
  Response as ResponseExpress,
} from "express";
import { formatResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";
import {
  completeUpload,
  startUpload,
  uploadToS3,
} from "../services/contribute.services/uploadFile.service";
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  Response,
  Request,
  Tags,
  TsoaResponse,
  Res,
  Middlewares,
  UploadedFile,
  FormField,
} from "tsoa";
import { verifyToken } from "../middlewares/verify-token";
import { SuccessResponseInterface } from "../interfaces/api-interface";

import prisma from "../prisma/client";
import { Problem } from "@prisma/client";
import {
  findAllPendingContributions,
  findPendingContribution,
} from "../services/problem.services/contribution.services";

@Route("/api/contributions") // Base path for contribution-related routes
@Tags("Contributions") // Group this endpoint under "Contributions" in Swagger
export class ContributionController extends Controller {
  @SuccessResponse("201", "Contribute submitted successfully")
  @Post("")
  @Middlewares(verifyToken) // Middleware to verify the user's token
  public async submitContribute(
    @Request() req: RequestExpress, // Request object for user ID and file
    @FormField() title: string, // Request body for contribution details
    @FormField() description: string,
    @FormField() difficulty: string,
    @FormField() tags: string,
    @FormField() timeLimit: string,
    @FormField() memoryLimit: string,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<SuccessResponseInterface<{ contribution: Problem }>> {
    // Step 1: Start file upload process
    const details = await startUpload(file);

    // Step 2: Upload chunks to S3
    const etags = await uploadToS3(file, details.chunk_size, details.urls);

    // Step 3: Complete file upload and get the file URL
    const url = await completeUpload(details.key, details.upload_id!, etags);

    // Step 4: Save file information to the database
    const filename = `${title.replace(/\s+/g, "_")}_${Date.now()}`;
    const createFile = await prisma.files.create({
      data: {
        filename: filename,
        location: url,
        filesize: file.size,
        fileType: file.mimetype,
      },
    });

    // Step 5: Save contribution details to the database
    const contribution = await prisma.problem.create({
      data: {
        title: title,
        description: description,
        difficulty: parseInt(difficulty, 10),
        tags: tags,
        timeLimit: parseInt(timeLimit, 10),
        memoryLimit: parseInt(memoryLimit, 10),
        authorId: req.userId, // Accessing the user's ID from the request
        fileId: createFile.fileId,
      },
    });

    // Step 6: Return a success response
    return {
      message: "Contribute submitted successfully",
      data: { contribution: contribution },
    };
  }

  @Get("/")
  @SuccessResponse("200", "All contributions fetched successfully")
  public async getAllContribute(): Promise<
    SuccessResponseInterface<{ contributions: Problem[] }>
  > {
    // Fetch all pending contributions
    const contributions = await findAllPendingContributions();

    // Return a success response with the fetched contributions
    return {
      message: "Get all contributions successfully",
      data: { contributions: contributions },
    };
  }

  @Get("{contribute_id}")
  @SuccessResponse("200", "Contribute fetched successfully")
  public async getOneContribute(
    @Path() contribute_id: number, // Contribution ID as a path parameter
  ): Promise<SuccessResponseInterface<{ contribution: Problem }>> {
    // Fetch the pending contribution using the provided ID
    const contribution = await findPendingContribution(contribute_id);

    // Return a success response with the fetched contribution
    return {
      message: "Contribute fetched successfully",
      data: { contribution: contribution },
    };
  }
}

// const searchContribute = async (
//   req: RequestExpress,
//   res: ResponseExpress,
// ) => {};

// const getOneContribute = async (req: RequestExpress, res: ResponseExpress) => {
//   const { contribute_id } = req.params;
//
//   const contribution = await findPendingContribution(parseInt(contribute_id));
//
//   return formatResponse(
//     res,
//     "SUCCESS",
//     "Contribute fetch successfully",
//     STATUS_CODE.SUCCESS,
//     { contribution: contribution },
//   );
// };

// const getAllContribute = async (req: RequestExpress, res: ResponseExpress) => {
//   const contributions = await findAllPendingContributions();
//
//   return formatResponse(
//     res,
//     "SUCCESS",
//     "Get all contributions successfully",
//     STATUS_CODE.SUCCESS,
//     { contributions: contributions },
//   );
// };

const acceptContribute = async (req: RequestExpress, res: ResponseExpress) => {
  const { contribute_id } = req.params;

  const existingContribute = await prisma.problem.findUnique({
    where: {
      problemId: parseInt(contribute_id, 10),
    },
  });

  if (existingContribute?.status !== 0) {
    return formatResponse(
      res,
      "BAD_REQUEST",
      "Contribution is not in pending state",
      STATUS_CODE.BAD_REQUEST,
      {},
    );
  }

  const contribute = await prisma.problem.update({
    where: {
      problemId: parseInt(contribute_id, 10),
    },
    data: {
      status: 2,
    },
  });

  return formatResponse(
    res,
    "SUCCESS",
    "Contribute accepted successfully",
    STATUS_CODE.SUCCESS,
    { contribute },
  );
};

const rejectContribute = async (req: RequestExpress, res: ResponseExpress) => {
  const { contribute_id } = req.params;

  const existingContribute = await prisma.problem.findUnique({
    where: {
      problemId: parseInt(contribute_id, 10),
    },
  });

  if (existingContribute?.status !== 0) {
    return formatResponse(
      res,
      "BAD_REQUEST",
      "Contribution is not in pending state",
      STATUS_CODE.BAD_REQUEST,
      {},
    );
  }

  const contribute = await prisma.problem.update({
    where: {
      problemId: parseInt(contribute_id, 10),
    },
    data: {
      status: 1,
    },
  });

  return formatResponse(
    res,
    "SUCCESS",
    "Contribute rejected successfully",
    STATUS_CODE.SUCCESS,
    { contribute },
  );
};
