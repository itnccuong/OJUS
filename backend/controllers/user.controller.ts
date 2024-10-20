import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { formatResponse, STATUS_CODE } from "../utils/services";

interface ProfileRequest extends Request {
  params: {
    username: string;
  };
}

const getProfileByName = async (req: ProfileRequest, res: Response) => {
  try {
    const prisma = new PrismaClient();
    const username = req.params.username

    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Username not exists!"
      );
    }

    return formatResponse(
      res,
      {
        user: user,
      },
      STATUS_CODE.SUCCESS,
      "Get profile successfully!"
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      err.message
    );
  }
};

export { getProfileByName };
