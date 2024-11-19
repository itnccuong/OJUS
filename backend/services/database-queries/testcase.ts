import { PrismaClient } from "@prisma/client";
import { FindTestByProblemIdError } from "../../utils/error";

const prisma = new PrismaClient();

export const findTestsByProblemId = async (problem_id: number) => {
  const testcases = await prisma.testCase.findMany({
    where: {
      problemId: problem_id,
    },
  });
  if (!testcases.length) {
    throw new FindTestByProblemIdError("Testcase not found", problem_id);
  }
  return testcases;
};
