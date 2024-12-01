import prisma from "../../prisma/client";

export const queryProblems = async () => {
  const problems = await prisma.problem.findMany();
  return problems;
};
