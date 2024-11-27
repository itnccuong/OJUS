import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { formatResponse, STATUS_CODE } from "../utils/services";


const prisma = new PrismaClient();

interface SubmitContribute extends Request {
  user?: any;
  file?: any;
}

const submitContribute = async (req: SubmitContribute, res: Response) => {
  try {
    const { title, description, difficulty, tags, timeLimit, memoryLimit, fileUrl, fileSize, fileType} = req.body;

    if (!title || !description || !difficulty || !tags || !timeLimit || !memoryLimit || !fileUrl || !fileSize || !fileType) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Please fill all fields!",
      );
    }

    const filename = `${title.replace(/\s+/g, '_')}_${Date.now()}`;

    const file = await prisma.files.create({
      data: {
        filename: filename,
        location: fileUrl,
        filesize: fileSize,
        fileType: fileType
      }
    });

    
    const contribute = await prisma.problem.create({
      data: {
      title: title,
      description: description,
      difficulty: parseInt(difficulty, 10),
      tags: tags,
      timeLimit: parseInt(timeLimit, 10),
      memoryLimit: parseInt(memoryLimit, 10),
      authorId: req.user.userId,
      fileId: file.fileId
      },
    });

    return formatResponse(
      res,
      { contribute },
      STATUS_CODE.SUCCESS,
      "Contribute submitted successfully!",
    );
  } catch (err: any) {
    return formatResponse(res, {}, STATUS_CODE.SERVICE_UNAVAILABLE, err.message);
  }
};

const searchContribute = async (req: Request, res: Response) => {
};

const getOneContribute = async (req: Request, res: Response) => {
  try {
    const { contribute_id } = req.params;

    const contribute = await prisma.problem.findUnique({
      where: {
        problemId: parseInt(contribute_id, 10),
        isActive: false,
      },
    });

    if (!contribute) {
      return formatResponse(res, {}, STATUS_CODE.NOT_FOUND, "Contribute not found!");
    }

    return formatResponse(res, { contribute }, STATUS_CODE.SUCCESS, "Contribute fetch successfully!");
  } catch (err: any) {
    return formatResponse(res, {}, STATUS_CODE.SERVICE_UNAVAILABLE, err.message);
  }
};

const getAllContribute = async (req: Request, res: Response) => {
  try {
    // Lấy tất cả các contribute với isActive = false
    const contributes = await prisma.problem.findMany({
      where: {
        isActive: false,
      },
    });

    // Kiểm tra nếu không có kết quả nào
    if (!contributes || contributes.length === 0) {
      return formatResponse(res, {}, STATUS_CODE.NOT_FOUND, "No contributes found!");
    }

    // Trả về kết quả
    return formatResponse(res, { contributes }, STATUS_CODE.SUCCESS, "Contributes fetched successfully!");
  } catch (err: any) {
    // Xử lý lỗi nếu có
    return formatResponse(res, {}, STATUS_CODE.SERVICE_UNAVAILABLE, err.message);
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

    if (existingContribute?.isActive) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Contribute is already accepted!",
      );
    }

    const contribute = await prisma.problem.update({
      where: {
        problemId: parseInt(contribute_id, 10),
      },
      data: {
        isActive: true,
      },
    });

    return formatResponse(
      res,
      { contribute },
      STATUS_CODE.SUCCESS,
      "Contribute accepted successfully!",
    );
  } catch (err: any) {
    return formatResponse(res, {}, STATUS_CODE.SERVICE_UNAVAILABLE, err.message);
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

    if (existingContribute?.isActive == false) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Contribute is already rejected!",
      );
    }

    const contribute = await prisma.problem.update({
      where: {
        problemId: parseInt(contribute_id, 10),
      },
      data: {
        isActive: false,
      },
    });

    return formatResponse(
      res,
      { contribute },
      STATUS_CODE.SUCCESS,
      "Contribute rejected successfully!",
    );
  } catch (err: any) {
    return formatResponse(res, {}, STATUS_CODE.SERVICE_UNAVAILABLE, err.message);
  }
};

export { searchContribute, getOneContribute, getAllContribute, submitContribute, acceptContribute, rejectContribute };