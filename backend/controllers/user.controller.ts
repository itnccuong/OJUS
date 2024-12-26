import dotenv from "dotenv";
dotenv.config();

import { PrismaClient, type User } from "@prisma/client";
import { Request as RequestExpress } from "express";
import {
  Controller,
  Get,
  Middlewares,
  Path,
  Route,
  SuccessResponse,
  Request,
  Tags,
  UploadedFile,
  Patch,
  Delete,
  Body,
} from "tsoa";
import { verifyToken } from "../middlewares/verify-token";
import {
  SubmissionWithProblem,
  SuccessResponseInterface,
  UserWithAvatarInterface,
} from "../interfaces/interface";
import {
  addProblemToSubmissions,
  filterSubmissionsAC,
  findAvatarById,
  findSubmissionsUser,
  findUserById,
  findUserByName,
  updateUserService,
  uploadAvatar,
} from "../services/user.services/user.services";

const prisma = new PrismaClient();

@Route("/api/user")
@Tags("User")
export class UserController extends Controller {
  @Get("/")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched user profile")
  public async getUserProfile(
    @Request() req: RequestExpress,
  ): Promise<SuccessResponseInterface<{ user: UserWithAvatarInterface }>> {
    const userId = req.userId;
    const user = await findUserById(userId);
    const avatar = await findAvatarById(user.avatarId);
    return {
      data: {
        user: {
          ...user,
          avatar: avatar,
        },
      },
    };
  }

  @Get("/by-name/{username}")
  @SuccessResponse(200, "Successfully fetched user profile")
  public async getUserByName(
    @Path() username: string,
  ): Promise<SuccessResponseInterface<{ user: UserWithAvatarInterface }>> {
    const user = await findUserByName(username);
    const avatar = await findAvatarById(user.avatarId);
    return {
      data: {
        user: {
          ...user,
          avatar: avatar,
        },
      },
    };
  }

  @Patch("/")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched user profile")
  public async updateProfile(
    @Request() req: RequestExpress,
    @Body()
    requestBody: {
      fullname?: string;
      facebookLink?: string;
      githubLink?: string;
      currentPassword?: string;
      newPassword?: string;
    },
  ): Promise<SuccessResponseInterface<{ user: User }>> {
    const updateUser = await updateUserService(req.userId, requestBody);
    return {
      data: {
        user: updateUser,
      },
    };
  }

  @Get("/submissions")
  @Middlewares(verifyToken)
  @SuccessResponse(200, "Successfully fetched submissions from user")
  public async getSubmissionsFromUser(
    @Request() req: RequestExpress,
  ): Promise<
    SuccessResponseInterface<{ submissions: SubmissionWithProblem[] }>
  > {
    const userId = req.userId;
    const submissions = await findSubmissionsUser(userId);
    const submissionsWithProblem = await addProblemToSubmissions(submissions);
    return {
      data: { submissions: submissionsWithProblem },
    };
  }

  @Get("/{userId}/submissions/AC")
  @SuccessResponse(200, "Successfully fetched submissions from user")
  public async getACSubmissionsFromUser(
    @Path() userId: number,
  ): Promise<
    SuccessResponseInterface<{ submissions: SubmissionWithProblem[] }>
  > {
    const submissions = await findSubmissionsUser(userId);
    const submissionFilteredAC = await filterSubmissionsAC(submissions);
    const submissionsWithProblem =
      await addProblemToSubmissions(submissionFilteredAC);
    return {
      data: { submissions: submissionsWithProblem },
    };
  }

  @SuccessResponse("200", "Update avatar successfully")
  @Patch("/avatar")
  @Middlewares(verifyToken) // Middleware to verify the user's token
  public async uploadAvatar(
    @Request() req: RequestExpress, // Request object for user ID and file
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<SuccessResponseInterface<{ user: UserWithAvatarInterface }>> {
    const avatar = await uploadAvatar(file);

    //update avatarId in user table
    const userId = req.userId;
    const user = await prisma.user.update({
      where: { userId },
      data: {
        avatarId: avatar.fileId,
      },
    });
    return {
      data: {
        user: {
          ...user,
          avatar: avatar,
        },
      },
    };
  }

  @SuccessResponse("200", "Delete avatar successfully")
  @Delete("/avatar")
  @Middlewares(verifyToken) // Middleware to verify the user's token
  public async deleteAvatar(
    @Request() req: RequestExpress, // Request object for user ID and file
  ): Promise<SuccessResponseInterface<{ user: User }>> {
    const userId = req.userId;
    const user = await findUserById(userId);
    await prisma.user.update({
      where: { userId },
      data: {
        avatarId: null,
      },
    });
    return {
      data: {
        user: user,
      },
    };
  }
}
