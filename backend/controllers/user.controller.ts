import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { formatResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";
import jwt from "jsonwebtoken";

interface ProfileRequest extends Request {
  params: {
    username: string;
  };
}
interface UserRequest extends Request {
  params: {
    userId: string;
  };
}
interface UpdateProfileRequest extends Request {
  body: {
    fullname?: string;
    gender?: string;
    birthday?: Date;
    facebookLink?: string;
    githubLink?: string;
    currentPassword?: string;
    newPassword?: string;
  };
  user?: { userId: number };
}

const prisma = new PrismaClient();

const extractUserIdFromToken = (token: string): number | null => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || "default_secret_key") as { userId: number };
    return decoded.userId;
  } catch (err) {
    return null;
  }
};

const updateProfile = async (req: UpdateProfileRequest, res: Response) => {
  try {
    // Ensure user is authenticated
    if (!req.userId) {
      return formatResponse(
        res, 
        {}, 
        STATUS_CODE.UNAUTHORIZED, 
        "Authentication required!"
      );
    }

    const userId = req.userId;
    const {
      fullname,
      gender,
      birthday,
      facebookLink,
      githubLink,
      currentPassword,
      newPassword
    } = req.body;

    // Find the existing user
    const existingUser = await prisma.user.findUnique({
      where: { userId }
    });

    if (!existingUser) {
      return formatResponse(
        res, 
        {}, 
        STATUS_CODE.BAD_REQUEST, 
        "User not found!"
      );
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return formatResponse(
          res, 
          {}, 
          STATUS_CODE.BAD_REQUEST, 
          "Current password is required to change password!"
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword, 
        existingUser.password
      );

      if (!isPasswordValid) {
        return formatResponse(
          res, 
          {}, 
          STATUS_CODE.BAD_REQUEST, 
          "Current password is incorrect!"
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      fullname,
      gender,
      birthday,
      facebookLink,
      githubLink
    };

    // Hash new password if provided
    if (newPassword) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(newPassword, saltRounds);
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: updateData
    });

    // Remove sensitive information before sending response
    const { password, ...safeUser } = updatedUser;

    return formatResponse(
      res, 
      { user: safeUser }, 
      STATUS_CODE.SUCCESS, 
      "Profile updated successfully!"
    );

  } catch (err: any) {
    console.error('Profile update error:', err);
    return formatResponse(
      res, 
      {}, 
      STATUS_CODE.INTERNAL_SERVER_ERROR, 
      err.message
    );
  }
};

const getProfileByName = async (req: ProfileRequest, res: Response) => {
  try {
    const username = req.params.username;

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
        "Username not exists!",
      );
    }

    return formatResponse(
      res,
      {
        user: user,
      },
      STATUS_CODE.SUCCESS,
      "Get profile successfully!",
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      err.message,
    );
  }
};

const getUserByID = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.userId;
    console.log(userId)

    // Find user in the database by userId
    const user = await prisma.user.findUnique({
      where: {
        userId: userId,  // Assuming `id` is the primary key for users in the Prisma schema
      },
    });

    if (!user) {
      return formatResponse(
        res,
        {},
        STATUS_CODE.BAD_REQUEST,
        "User ID does not exist!"
      );
    }

    console.log("USersss", user);

    return formatResponse(
      res,
      { user: user },
      STATUS_CODE.SUCCESS,
      "User fetched successfully!"
    );
  } catch (err: any) {
    return formatResponse(
      res,
      {},
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      `Error in backend${err.message}`
    );
  }
};


export { updateProfile, getUserByID, getProfileByName };
