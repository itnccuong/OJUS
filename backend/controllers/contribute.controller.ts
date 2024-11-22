import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { formatResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";
import { UserConfig } from "../interfaces";

const prisma = new PrismaClient();

interface CustomRequest extends Request {
  user?: UserConfig;
  file?: any;
}

const submitContribute = async (req: CustomRequest, res: Response) => {
  try {
    const { title, description, difficulty, tags, timelimit, memorylimit } =
      req.body;

    if (
      !title ||
      !description ||
      !difficulty ||
      !tags ||
      !timelimit ||
      !memorylimit
    ) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Please fill all fields!",
      );
    }

    const contribute = await prisma.problem.create({
      data: {
        title: title,
        description: description,
        difficulty: difficulty,
        tags: tags,
        timeLimit: timelimit,
        memoryLimit: memorylimit,
        authorId: req.user!.userId,
        fileId: req.file.fileId,
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

const getOneContribute = async (req: Request, res: Response) => {};

const acceptContribute = async (req: Request, res: Response) => {};

const rejectContribute = async (req: Request, res: Response) => {};

export {
  searchContribute,
  getOneContribute,
  submitContribute,
  acceptContribute,
  rejectContribute,
};
