import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { Request as RequestExpress, Response } from "express";
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
  GetAllACSubmissionsFromUserInterface,
  GetAllSubmissionsFromUserInterface,
  SuccessResponseInterface,
  UpdateAvatarInterface,
  UpdateUserRequestInterface,
  UserResponseInterface,
  UserWithAvatarResponseInterface,
} from "../interfaces/api-interface";
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
  ): Promise<SuccessResponseInterface<UserWithAvatarResponseInterface>> {
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

  @Get("/{username}")
  @SuccessResponse(200, "Successfully fetched user profile")
  public async getUserByName(
    @Path() username: string,
  ): Promise<SuccessResponseInterface<UserWithAvatarResponseInterface>> {
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
    @Body() requestBody: UpdateUserRequestInterface,
  ): Promise<SuccessResponseInterface<UserResponseInterface>> {
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

  @SuccessResponse("200", "Update avatar successfully")
  @Patch("/avatar")
  @Middlewares(verifyToken) // Middleware to verify the user's token
  public async uploadAvatar(
    @Request() req: RequestExpress, // Request object for user ID and file
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<SuccessResponseInterface<UpdateAvatarInterface>> {
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
  ): Promise<SuccessResponseInterface<UserResponseInterface>> {
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
