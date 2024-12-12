import prisma from "../../prisma/client";
import { CustomError } from "../../utils/error";
import { STATUS_CODE } from "../../utils/constants";

export const findSubmissionById = async (submission_id: number) => {
  const submission = await prisma.submission.findUnique({
    where: {
      submissionId: submission_id,
    },
  });

  if (!submission) {
    throw new CustomError(
      "NOT_FOUND",
      "Submission not exists",
      STATUS_CODE.NOT_FOUND,
      {},
    );
  }
  return submission;
};

export const findResultBySubmissionId = async (submission_id: number) => {
  const results = await prisma.result.findMany({
    where: {
      submissionId: submission_id,
    },
  });

  return results;
};
