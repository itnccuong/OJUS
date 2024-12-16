import bcrypt from "bcryptjs";

import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request as RequestExpress, Response } from "express";
import { formatResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";
import {
  Controller,
  Get,
  Middlewares,
  Path,
  Route,
  SuccessResponse,
  Request,
  Tags,
} from "tsoa";
import { verifyToken } from "../middlewares/verify-token";
import {
  GetAllACSubmissionsFromUserInterface,
  GetAllSubmissionsFromProblemInterface,
  GetAllSubmissionsFromUserInterface,
  SuccessResponseInterface,
} from "../interfaces/api-interface";
import {
  addResultsToSubmissions,
  findSubmissionsProblem,
} from "../services/problem.services/problem.service";
import {
  addProblemToSubmissions,
  filterSubmissionsAC,
  findSubmissionsUser,
} from "../services/user.services/user.services";

interface ProfileRequest extends RequestExpress {
  params: {
    username: string;
  };
}
interface UserRequest extends RequestExpress {
  params: {
    userId: string;
  };
}
interface UpdateProfileRequest extends RequestExpress {
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

const updateProfile = async (req: UpdateProfileRequest, res: Response) => {
  try {
    // Ensure user is authenticated
    if (!req.userId) {
      return formatResponse(
        res,
        "Authentication required!",
        STATUS_CODE.UNAUTHORIZED,
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
      newPassword,
    } = req.body;

    // Find the existing user
    const existingUser = await prisma.user.findUnique({
      where: { userId },
    });

    if (!existingUser) {
      return formatResponse(res, "User not found!", STATUS_CODE.BAD_REQUEST);
    }

    // If changing password, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return formatResponse(
          res,
          "Current password is required to change password!",
          STATUS_CODE.BAD_REQUEST,
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        existingUser.password,
      );

      if (!isPasswordValid) {
        return formatResponse(
          res,
          "Current password is incorrect!",
          STATUS_CODE.BAD_REQUEST,
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      fullname,
      gender,
      birthday,
      facebookLink,
      githubLink,
    };

    // Hash new password if provided
    if (newPassword) {
      const saltRounds = 10;
      updateData.password = await bcrypt.hash(newPassword, saltRounds);
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { userId },
      data: updateData,
    });

    // Remove sensitive information before sending response
    const { password, ...safeUser } = updatedUser;

    // return formatResponse(
    //   res,
    //   { user: safeUser },
    //   STATUS_CODE.SUCCESS,
    //   "Profile updated successfully!",
    // );
    return res.status(200).json({
      message: "Profile updated successfully!",
      data: {
        user: safeUser,
      },
    });
  } catch (err: any) {
    console.error("Profile update error:", err);
    return formatResponse(res, err.message, STATUS_CODE.INTERNAL_SERVER_ERROR);
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
        "Username not exists!",
        STATUS_CODE.BAD_REQUEST,
      );
    }
    return res.status(200).json({
      message: "Get profile successfully!",
      data: {
        user: user,
      },
    });
  } catch (err: any) {
    return formatResponse(res, err.message, STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};

const getUserByID = async (req: UserRequest, res: Response) => {
  try {
    const userId = req.userId;
    console.log(userId);

    // Find user in the database by userId
    const user = await prisma.user.findUnique({
      where: {
        userId: userId, // Assuming `id` is the primary key for users in the Prisma schema
      },
    });

    if (!user) {
      return formatResponse(
        res,
        "User ID does not exist!",
        STATUS_CODE.BAD_REQUEST,
      );
    }

    // return formatResponse(
    //   res,
    //   { user: user },
    //   STATUS_CODE.SUCCESS,
    //   "User fetched successfully!",
    // );
    return res.status(200).json({
      message: "User fetched successfully!",
      data: {
        user: user,
      },
    });
  } catch (err: any) {
    return formatResponse(
      res,
      `Error in backend${err.message}`,
      STATUS_CODE.INTERNAL_SERVER_ERROR,
    );
  }
};

@Route("/api/user") // Base path for submission-related routes
@Tags("User") // Group this endpoint under "Submission" in Swagger
export class UserController extends Controller {
  @Get("/submissions")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched submissions from user")
  public async getSubmissionsFromUser(
    @Request() req: RequestExpress,
  ): Promise<SuccessResponseInterface<GetAllSubmissionsFromUserInterface>> {
    const userId = req.userId;
    const submissions = await findSubmissionsUser(userId);
    return {
      data: { submissions: submissions },
    };
  }

  @Get("/{userId}/submissions/AC")
  @SuccessResponse(200, "Successfully fetched submissions from user")
  public async getACSubmissionsFromUser(
    @Path() userId: number,
  ): Promise<SuccessResponseInterface<GetAllACSubmissionsFromUserInterface>> {
    const submissions = await findSubmissionsUser(userId);
    const submissionFilteredAC = await filterSubmissionsAC(submissions);
    const submissionsWithProblem =
      await addProblemToSubmissions(submissionFilteredAC);
    return {
      data: { submissions: submissionsWithProblem },
    };
  }
}

export { updateProfile, getUserByID, getProfileByName };
