import prisma from "../../prisma/client";

export const queryProblems = async () => {
  const problems = await prisma.problem.findMany({
    where: {
      status: 2,
    },
  });

  const res = problems.map((problem) => ({
    ...problem,
    userStatus: false,
  }));
  return res;
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

export const getUserStatus = async (userId: number, problemId: number) => {
  const userProblemStatus = await prisma.userProblemStatus.findFirst({
    where: {
      userId: userId,
      problemId: problemId,
    },
  });

  return {
    userStatus: !!userProblemStatus,
  };
};

export const findSubmissionsProblem = async (
  problem_id: number,
  userId: number,
) => {
  const submissions = await prisma.submission.findMany({
    where: {
      problemId: problem_id,
      userId: userId,
    },
  });
  return submissions;
};
