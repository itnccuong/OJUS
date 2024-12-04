import bcrypt from "bcrypt";
import prisma from "./client";
import { Files, Problem, User, UserProblemStatus } from "@prisma/client";
import { numAccept, numPending, numReject } from "../__test__/test_data";

async function main() {
  const length = numPending + numAccept + numReject;
  // Helper function to upsert data
  async function upsertData<T>(model: any, data: T[], key: keyof T) {
    for (const item of data) {
      await model.upsert({
        create: item,
        where: { [key]: item[key] },
        update: item,
      });
    }
  }

  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("1", salt);

  // Define user data
  const userData: User = {
    userId: 1,
    email: "hienvuongnhat@gmail.com",
    password: hashedPassword,
    fullname: "Hien",
    username: "hien",
    createdAt: new Date(),
  };

  // Define files data
  const filesData: Files[] = Array.from({ length: length }, (_, index) => ({
    fileId: index + 1,
    filename: `testcase_${index + 1}`,
    filesize: 1057,
    fileType: "application/x-zip-compressed",
    location:
      "https://hien-leetcode-test.s3.ap-southeast-2.amazonaws.com/64164fde-9909-4777-845a-f6df3eb31cb1%2Ftestcases.zip",
    createdAt: new Date(),
  }));

  // Define problems data
  const problemsData: Problem[] = Array.from(
    { length: length },
    (_, index) => ({
      problemId: index + 1,
      title: `Problem ${index + 1}`,
      description: `Description for problem ${index + 1}`,
      status: index < numPending ? 0 : index < numPending + numReject ? 1 : 2,
      difficulty: index + 1,
      tags: `Tag ${index + 1}`,
      timeLimit: (index + 1) * 1000,
      memoryLimit: (index + 1) * 1000,
      authorId: 1,
      fileId: index + 1,
      createdAt: new Date(),
    }),
  );

  // Upsert data
  await upsertData(prisma.user, [userData], "userId");
  await upsertData(prisma.files, filesData, "fileId");
  await upsertData(prisma.problem, problemsData, "problemId");
  await upsertData(prisma.problem, problemsData, "problemId");
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
