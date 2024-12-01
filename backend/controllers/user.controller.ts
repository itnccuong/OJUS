import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { formatResponseNew } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";

interface ProfileRequest extends Request {
  params: {
    username: string;
  };
}

const prisma = new PrismaClient();
const getProfileByName = async (req: ProfileRequest, res: Response) => {
  const username = req.params.username;

  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });

  if (!user) {
    return formatResponseNew(
      res,
      "USERNAME_NOT_EXISTS",
      "Username not exists!",
      STATUS_CODE.BAD_REQUEST,
      {},
    );
  }

  return formatResponseNew(
    res,
    "SUCCESS",
    "Get profile successfully!",
    STATUS_CODE.SUCCESS,
    { user: user },
  );
};

export { getProfileByName };
