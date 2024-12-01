import prisma from "../../prisma/client";

export const queryProblems = async () => {
  const problems = await prisma.problem.findMany({
    where: {
      status: 2,
    },
  });
  return problems;
};

export const queryProblemStatus = async (userId: number) => {
  const problems = await prisma.problem.findMany({
    where: {
      status: 2,
    },
  });
  const problemsWithStatus = await Promise.all(
    problems.map(async (problem) => {
      const userProblemStatus = await prisma.userProblemStatus.findFirst({
        where: {
          userId: userId,
          problemId: problem.problemId,
        },
      });
      return {
        ...problem,
        userStatus: userProblemStatus ? true : false,
      };
    }),
  );

  return problemsWithStatus;
};
