import prisma from "../prisma/client";

export const cleanDatabase = async () => {
  const deleteResult = prisma.result.deleteMany();
  const deleteSubmission = prisma.submission.deleteMany();
  const deleteFile = prisma.files.deleteMany();
  const deleteProblem = prisma.problem.deleteMany();
  const deleteUser = prisma.user.deleteMany();
  const deleteUserProblemStatus = prisma.userProblemStatus.deleteMany();

  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
  await prisma.$transaction([
    deleteUser,
    deleteFile,
    deleteProblem,
    deleteSubmission,
    deleteResult,
    deleteUserProblemStatus,
  ]);
  await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
};
