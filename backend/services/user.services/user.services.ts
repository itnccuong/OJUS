import prisma from "../../prisma/client";
import { Files, Submission, User } from "@prisma/client";
import { findResultBySubmissionId } from "../submission.services/submission.service";
import { findProblemById } from "../problem.services/submit.services";
import {
  digitalOceanConfig,
  STATUS_CODE,
  verdict,
} from "../../utils/constants";
import { deleteFile, uploadFile } from "../../utils/uploadFileUtils";
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

export const findAvatarById = async (avatarId: number | null) => {
  if (!avatarId) {
    throw new CustomError("User does not have avatar", STATUS_CODE.NOT_FOUND);
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
  const bucket = digitalOceanConfig.bucket;
  const location = "avatars";
  const resUploadFile = await uploadFile(bucket, location, file);
  const avatar = await prisma.files.create({
    data: {
      filename: file.originalname,
      url: resUploadFile.url,
      filesize: file.size,
      fileType: file.mimetype,
      bucket: bucket,
      key: resUploadFile.key,
    },
  });
  return avatar;
};

export const deleteAvatar = async (file: Files) => {
  const bucket = file.bucket;
  const key = file.key;
  await deleteFile(bucket, key);
  await prisma.files.delete({
    where: {
      fileId: file.fileId,
    },
  });
};
