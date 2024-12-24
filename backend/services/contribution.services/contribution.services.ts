import prisma from "../../prisma/client";
import { CustomError } from "../../utils/errorClass";
import { STATUS_CODE } from "../../utils/constants";
import { formatResponse } from "../../utils/formatResponse";

export const findPendingContribution = async (problemId: number) => {
  const res = await prisma.problem.findUnique({
    where: {
      problemId: problemId,
      status: 0,
    },
  });
  if (!res) {
    throw new CustomError(
      "Cannot find pending contribution",
      STATUS_CODE.NOT_FOUND,
    );
  }
  return res;
};

export const findAllPendingContributions = async () => {
  const contributions = await prisma.problem.findMany({
    where: {
      status: 0,
    },
  });

  return contributions;
};

export const findSubmissionsContribution = async (
  problem_id: number,
  userId: number,
) => {
  const submissions = await prisma.submission.findMany({
    where: {
      userId,
      problemId: problem_id,
      problem: {
        status: 0,
      },
    },
    include: {
      problem: true, // This joins with the problems table
    },
    orderBy: {
      submissionId: "desc",
    },
  });
  return submissions;
};
