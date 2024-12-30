import prisma from "../prisma/client";
import { Files, Problem, User } from "@prisma/client";

export const cleanDatabase = async () => {
  const deleteResult = prisma.result.deleteMany();
  const deleteSubmission = prisma.submission.deleteMany();
  const deleteFile = prisma.files.deleteMany();
  const deleteProblem = prisma.problem.deleteMany();
  const deleteUser = prisma.user.deleteMany();

  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
  await prisma.$transaction([
    deleteUser,
    deleteFile,
    deleteProblem,
    deleteSubmission,
    deleteResult,
  ]);
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
};

export const insertUser = async (user: User) => {
  await prisma.user.create({
    data: user,
  });
};

export const insertProblem = async (problem: Problem) => {
  await prisma.problem.create({
    data: problem,
  });
};

export const insertFile = async (file: Files) => {
  await prisma.files.create({
    data: file,
  });
};
