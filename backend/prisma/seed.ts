import bcrypt from "bcrypt";
import prisma from "./client";
import { Files, Problem, User } from "@prisma/client";
async function main() {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("1", salt);

  const fileData: Files = {
    fileId: 1,
    filename: "testcase_1732092562978",
    filesize: 1057,
    fileType: "application/x-zip-compressed",
    location:
      "https://hien-leetcode-test.s3.ap-southeast-2.amazonaws.com/64164fde-9909-4777-845a-f6df3eb31cb1%2Ftestcases.zip",
    createdAt: new Date(),
  };
  const userData: User = {
    userId: 1,
    email: "hienvuongnhat@gmail.com",
    password: hashedPassword,
    fullname: "Hien",
    username: "hien",
    createdAt: new Date(),
  };
  const problemData: Problem = {
    problemId: 1,
    title: "1",
    description: "1",
    status: 0,
    difficulty: 1,
    tags: "1",
    timeLimit: 1000,
    memoryLimit: 1000,
    authorId: 1,
    fileId: 1,
    createdAt: new Date(),
  };

  await prisma.files.upsert({
    create: fileData,
    where: { fileId: fileData.fileId },
    update: fileData,
  });
  await prisma.user.upsert({
    create: userData,
    where: { userId: userData.userId },
    update: userData,
  });
  await prisma.problem.upsert({
    create: problemData,
    where: { problemId: problemData.problemId },
    update: problemData,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
