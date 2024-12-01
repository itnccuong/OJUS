import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { formatResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";
import {
  completeUpload,
  startUpload,
  uploadToS3,
} from "../services/contribute.services/uploadFile.service";
import uploadRoute from "../upload/upload.route";

const prisma = new PrismaClient();

interface SubmitContributeRequest extends Request {
  body: {
    title: string;
    description: string;
    difficulty: string;
    tags: string;
    timeLimit: string;
    memoryLimit: string;
  };
}

const submitContribute = async (
  req: SubmitContributeRequest,
  res: Response,
) => {
  try {
    const { title, description, difficulty, tags, timeLimit, memoryLimit } =
      req.body;
    const file = req.file;
    if (!file) {
      console.log("No file");
      return null;
    }
    const details = await startUpload(file);
    console.log("Details", details);

    const etags = await uploadToS3(file, details.chunk_size, details.urls);

    const url = await completeUpload(details.key, details.upload_id!, etags);

    const filename = `${title.replace(/\s+/g, "_")}_${Date.now()}`;

    const createFile = await prisma.files.create({
      data: {
        filename: filename,
        location: url,
        filesize: file.size,
        fileType: file.mimetype,
      },
    });

    const contribute = await prisma.problem.create({
      data: {
        title: title,
        description: description,
        difficulty: parseInt(difficulty, 10),
        tags: tags,
        timeLimit: parseInt(timeLimit, 10),
        memoryLimit: parseInt(memoryLimit, 10),
        authorId: req.userId,
        fileId: createFile.fileId,
      },
    });

    return formatResponse(
      res,
      { contribute },
      STATUS_CODE.SUCCESS,
      "Contribute submitted successfully!",
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.SERVICE_UNAVAILABLE,
      err.message,
    );
  }
};

const searchContribute = async (req: Request, res: Response) => {};

const getOneContribute = async (req: Request, res: Response) => {
  try {
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
        {},
        STATUS_CODE.NOT_FOUND,
        "Contribute not found!",
      );
    }

    return formatResponse(
      res,
      { contribute },
      STATUS_CODE.SUCCESS,
      "Contribute fetch successfully!",
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.SERVICE_UNAVAILABLE,
      err.message,
    );
  }
};

const getAllContribute = async (req: Request, res: Response) => {
  try {
    // Lấy tất cả các contribute với isActive = false
    const contributions = await prisma.problem.findMany({
      where: {
        status: 0,
      },
    });

    // Kiểm tra nếu không có kết quả nào
    if (!contributions || contributions.length === 0) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.NOT_FOUND,
        "No contributions found!",
      );
    }

    // Trả về kết quả
    return formatResponse(
      res,
      { contributions },
      STATUS_CODE.SUCCESS,
      "Contributes fetched successfully!",
    );
  } catch (err: any) {
    // Xử lý lỗi nếu có
    return formatResponse(
      res,
      {},
      STATUS_CODE.SERVICE_UNAVAILABLE,
      err.message,
    );
  }
};

const acceptContribute = async (req: Request, res: Response) => {
  try {
    const { contribute_id } = req.params;

    const existingContribute = await prisma.problem.findUnique({
      where: {
        problemId: parseInt(contribute_id, 10),
      },
    });

    if (existingContribute?.status !== 0) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Contribution is not in pending state",
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
      { contribute },
      STATUS_CODE.SUCCESS,
      "Contribute accepted successfully!",
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.SERVICE_UNAVAILABLE,
      err.message,
    );
  }
};

const rejectContribute = async (req: Request, res: Response) => {
  try {
    const { contribute_id } = req.params;

    const existingContribute = await prisma.problem.findUnique({
      where: {
        problemId: parseInt(contribute_id, 10),
      },
    });

    if (existingContribute?.status !== 0) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Contribution is not in pending state",
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
      { contribute },
      STATUS_CODE.SUCCESS,
      "Contribute rejected successfully!",
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.SERVICE_UNAVAILABLE,
      err.message,
    );
  }
};

export {
  searchContribute,
  getOneContribute,
  getAllContribute,
  submitContribute,
  acceptContribute,
  rejectContribute,
};
