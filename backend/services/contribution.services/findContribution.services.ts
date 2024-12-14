import prisma from "../../prisma/client";
import { CustomError } from "../../utils/error";
import { STATUS_CODE } from "../../utils/constants";
import { formatResponse } from "../../utils/formatResponse";

export const findPendingContribution = async (contributionId: number) => {
  const res = await prisma.problem.findUnique({
    where: {
      problemId: contributionId,
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
