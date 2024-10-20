import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

import { formatResponse, STATUS_CODE } from "../utils/services";

const register = async (req: Request, res: Response) => {
  try {
    const prisma = new PrismaClient();

    const { email, fullname, password, username } = req.body;

    if (!email || !fullname || !password || !username) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Please fill all fields!"
      );
    }

    const existingEmail = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (existingEmail) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "A user is already registered with this e-mail address."
      );
    }

    const existingUsername = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (existingUsername) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Username cannot be used. Please choose another username."
      );
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        fullname: fullname,
        password: hashedPassword,
      },
    });

    return formatResponse(
      res,
      { user },
      STATUS_CODE.SUCCESS,
      "Create account successfully!"
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

const prisma = new PrismaClient();

const login = async (req: Request, res: Response) => {
  try {
    const { usernameOrEmail, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username: usernameOrEmail,
          },
          {
            email: usernameOrEmail,
          },
        ],
      },
    });

    if (!user) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Invalid email or username"
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "Invalid password"
      );
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id }, // Payload
      process.env.JWT_SECRET as string, // Secret
      { expiresIn: "3d" } // Token expiration
    );

    return formatResponse(
      res,
      {
        token: token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
      },
      STATUS_CODE.SUCCESS,
      "Login successfully!"
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

export { register, login };
