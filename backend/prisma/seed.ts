import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
async function main() {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("1", salt);

  const fileData = {
    fileId: 1,
    filename: "1",
    filesize: 1,
    fileType: "1",
    location: "1",
  };
  const userData = {
    userId: 1,
    email: "hienvuongnhat@gmail.com",
    password: hashedPassword,
    fullname: "Hien",
    username: "hien",
  };
  const problemData = {
    problemId: 1,
    title: "1",
    description: "1",
    isActive: true,
    difficulty: 1,
    tags: "1",
    timeLimit: 1000,
    memoryLimit: 100,
    authorId: 1,
    fileId: 1,
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
