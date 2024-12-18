import bcrypt from "bcryptjs";
import prisma from "./client";
import { Files, Problem, User } from "@prisma/client";

async function main() {
  // Hash the password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync("1", salt);

  // Define user data
  const userData: User = {
    userId: 1,
    email: "hienvuongnhat@gmail.com",
    password: hashedPassword,
    fullname: "Nhat Hien",
    username: "hien",
    avatarId: null,
    facebookLink: null,
    githubLink: null,
    createdAt: new Date(),
  };

  // Define files data
  const testcase1: Files = {
    fileId: 1,
    filename: "testcase.zip",
    filesize: 1057,
    fileType: "application/x-zip-compressed",
    url: "https://ojus-bucket.sgp1.cdn.digitaloceanspaces.com/testcases/c9fde101080b5b03_testcase.zip",
    createdAt: new Date(),
  };

  const testcase2: Files = {
    fileId: 2,
    filename: "test69.zip",
    filesize: 24190,
    fileType: "application/x-zip-compressed",
    url: "https://ojus-bucket.sgp1.cdn.digitaloceanspaces.com/testcases/9bc9ba906349656b_test69.zip",
    createdAt: new Date(),
  };

  const testcase3: Files = {
    fileId: 3,
    filename: "helloWorld.zip",
    filesize: 375,
    fileType: "application/x-zip-compressed",
    url: "https://ojus-bucket.sgp1.cdn.digitaloceanspaces.com/testcases/95221dc5a5897da7_helloWorld.zip",
    createdAt: new Date(),
  };

  // Define problems data
  const problem1: Problem = {
    problemId: 1,
    title: `Very Hard Problem`,
    description:
      "Write a program that reads an integer number from the standard input and outputs its negative value.\r\n\r\n#### Input Format\r\n\r\n- A single integer `N`\r\n\r\n#### Output Format\r\n\r\n- Output a single integer, which is the negative of the input number.\r\n\r\n#### Constraints\r\n\r\n- The input will always be a valid integer within the range `-10^9` to `10^9`.\r\n\r\n#### Example 1\r\n- **Input** : 1\r\n- **Output**: -1 \r\n\r\n#### Example 2\r\n- **Input** : 69\r\n- **Output**: -69 \r\n",
    status: 2,
    difficulty: 2,
    tags: `Array`,
    timeLimit: 1000,
    memoryLimit: 1000,
    authorId: 1,
    fileId: 1,
    createdAt: new Date(),
  };

  const problem2: Problem = {
    problemId: 2,
    title: `Hardest Problem Ever`,
    description:
      "Write a program that reads an integer number from the standard input and outputs its negative value.\r\n\r\n#### Input Format\r\n\r\n- A single integer `N`\r\n\r\n#### Output Format\r\n\r\n- Output a single integer, which is the negative of the input number.\r\n\r\n#### Constraints\r\n\r\n- The input will always be a valid integer within the range `-10^18` to `10^18`.\r\n\r\n#### Example 1\r\n- **Input** : 1\r\n- **Output**: -1 \r\n\r\n#### Example 2\r\n- **Input** : 69\r\n- **Output**: -69 \r\n",
    status: 2,
    difficulty: 3,
    tags: `String, Sorting`,
    timeLimit: 1000,
    memoryLimit: 1000,
    authorId: 1,
    fileId: 2,
    createdAt: new Date(),
  };

  const problem3: Problem = {
    problemId: 3,
    title: `Hello World`,
    description:
      "Write a program that outputs **Hello World** string\r\n\r\n#### Input\r\n\r\n- Nothing\r\n\r\n#### Output\r\n\r\n- **Hello World** string\r\n\r\n#### Constraints\r\n\r\n- Nothing\r\n\r\n#### Example 1\r\n- **Input** : null\r\n- **Output**: Hello World ",
    status: 2,
    difficulty: 1,
    tags: `Greedy`,
    timeLimit: 1000,
    memoryLimit: 1000,
    authorId: 1,
    fileId: 3,
    createdAt: new Date(),
  };
  // Upsert data
  await prisma.user.upsert({
    where: { userId: 1 },
    update: userData,
    create: userData,
  });
  await prisma.files.upsert({
    where: { fileId: 1 },
    update: testcase1,
    create: testcase1,
  });
  await prisma.files.upsert({
    where: { fileId: 2 },
    update: testcase2,
    create: testcase2,
  });
  await prisma.files.upsert({
    where: { fileId: 3 },
    update: testcase3,
    create: testcase3,
  });
  await prisma.problem.upsert({
    where: { problemId: 1 },
    update: problem1,
    create: problem1,
  });
  await prisma.problem.upsert({
    where: { problemId: 2 },
    update: problem2,
    create: problem2,
  });
  await prisma.problem.upsert({
    where: { problemId: 3 },
    update: problem3,
    create: problem3,
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
