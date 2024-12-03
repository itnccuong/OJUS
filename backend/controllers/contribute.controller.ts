import dotenv from "dotenv";
dotenv.config();

import { PrismaClient, Problem } from "@prisma/client";
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

const prisma = new PrismaClient();

interface SubmitContributeRequest {
  title: string;
  description: string;
  difficulty: string;
  tags: string;
  timeLimit: string;
  memoryLimit: string;
}

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
}

const searchContribute = async (
  req: RequestExpress,
  res: ResponseExpress,
) => {};

const getOneContribute = async (req: RequestExpress, res: ResponseExpress) => {
  const { contribute_id } = req.params;

  const contribute = await prisma.problem.findUnique({
    where: {
      problemId: parseInt(contribute_id, 10),
      status: 0,
    },
  });

  if (!contribute) {
    return formatResponse(
      res,
      "NOT_FOUND",
      "Contribute not found",
      STATUS_CODE.NOT_FOUND,
      {},
    );
  }

  return formatResponse(
    res,
    "SUCCESS",
    "Contribute fetch successfully",
    STATUS_CODE.SUCCESS,
    { contribute },
  );
};

const getAllContribute = async (req: RequestExpress, res: ResponseExpress) => {
  // Lấy tất cả các contribute với status 0 (chưa được duyệt)
  const contributions = await prisma.problem.findMany({
    where: {
      status: 0,
    },
  });

  // Kiểm tra nếu không có kết quả nào
  if (!contributions || contributions.length === 0) {
    return formatResponse(
      res,
      "NOT_FOUND",
      "No contributions found",
      STATUS_CODE.NOT_FOUND,
      {},
    );
  }

  return formatResponse(
    res,
    "SUCCESS",
    "Get all contributions successfully",
    STATUS_CODE.SUCCESS,
    { contributions },
  );
};

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

export {
  searchContribute,
  getOneContribute,
  getAllContribute,
  acceptContribute,
  rejectContribute,
};
