import prisma from "../../prisma/client";
import { Submission, User } from "@prisma/client";
import { STATUS_CODE, verdict } from "../../utils/constants";
import { uploadFile } from "../../utils/uploadFileUtils";
import { CustomError } from "../../utils/errorClass";
import { UpdateUserRequestInterface } from "../../interfaces/api-interface";
import bcrypt from "bcryptjs";
import { findProblemById } from "../problem.services/problem.service";

export const findUserById = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      userId,
    },
  });
  if (!user) {
    throw new CustomError("User not found in database!", STATUS_CODE.NOT_FOUND);
  }
  return user;
};

export const findUserByName = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (!user) {
    throw new CustomError("User not found in database!", STATUS_CODE.NOT_FOUND);
  }
  return user;
};

export const updateUserService = async (
  userId: number,
  body: UpdateUserRequestInterface,
) => {
  const existingUser = await findUserById(userId);
  let { fullname, facebookLink, githubLink, password } = existingUser;
  if (body.facebookLink !== undefined) {
    facebookLink = body.facebookLink;
  }
  if (body.githubLink !== undefined) {
    githubLink = body.githubLink;
  }
  if (body.fullname !== undefined) {
    if (body.fullname === "") {
      throw new CustomError("Fullname is required!", STATUS_CODE.BAD_REQUEST);
    }
    fullname = body.fullname;
  }
  if (body.currentPassword !== undefined && body.newPassword !== undefined) {
    if (body.newPassword === "" || body.currentPassword === "") {
      throw new CustomError(
        "New password is required!",
        STATUS_CODE.BAD_REQUEST,
      );
    }
    const isPasswordValid = await bcrypt.compare(
      body.currentPassword,
      password,
    );

    if (!isPasswordValid) {
      throw new CustomError(
        "Current password is incorrect!",
        STATUS_CODE.BAD_REQUEST,
      );
    }
    password = await bcrypt.hash(body.newPassword, 10);
  }
  const updatedUser = await prisma.user.update({
    where: {
      userId: existingUser.userId,
    },
    data: {
      fullname,
      facebookLink,
      githubLink,
      password,
    },
  });
  return updatedUser;
};

export const findAvatarById = async (avatarId: number | null) => {
  if (!avatarId) {
    return null;
  }
  const avatar = await prisma.files.findUnique({
    where: {
      fileId: avatarId,
    },
  });
  if (!avatar) {
    throw new CustomError(
      "Avatar not found in database!",
      STATUS_CODE.NOT_FOUND,
    );
  }
  return avatar;
};

export const findSubmissionsUser = async (userId: number) => {
  const submissions = await prisma.submission.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      submissionId: "desc",
    },
  });

  return submissions;
};

export const addProblemToSubmissions = async (submissions: Submission[]) => {
  const submissionsWithProblem = await Promise.all(
    submissions.map(async (submission) => {
      const problem = await findProblemById(submission.problemId);
      return {
        ...submission,
        problem: problem,
      };
    }),
  );
  return submissionsWithProblem;
};

export const filterSubmissionsAC = async (submissions: Submission[]) => {
  const submissionsFilteredAC = submissions.filter(
    (submission) => submission.verdict === verdict.OK,
  );
  return submissionsFilteredAC;
};

export const uploadAvatar = async (file: Express.Multer.File) => {
  const location = "avatars";
  const url = await uploadFile(location, file);
  const avatar = await prisma.files.create({
    data: {
      filename: file.originalname,
      filesize: file.size,
      fileType: file.mimetype,
      url: url,
    },
  });
  return avatar;
};
