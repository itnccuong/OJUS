import prisma from "../../prisma/client";
import { Submission } from "@prisma/client";
import { findProblemById } from "../problem.services/judging.services";
import { STATUS_CODE, verdict } from "../../utils/constants";
import { uploadFile } from "../../utils/uploadFileUtils";
import { CustomError } from "../../utils/errorClass";

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
      userId,
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
