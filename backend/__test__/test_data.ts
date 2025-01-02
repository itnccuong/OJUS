import { Files, Problem, Result, Submission, User } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verdict } from "../utils/constants";

// Generate salt and hashed password for testing
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync("12345678", salt);

// User and Admin data for testing
export const user: User = {
  userId: 1,
  email: "hienvuongnhat@gmail.com",
  password: hashedPassword,
  fullname: "Hien",
  username: "hien",
  avatarId: null,
  facebookLink: null,
  githubLink: null,
  createdAt: new Date(),
  admin: false,
};

export const admin: User = {
  userId: 2,
  email: "22120103@student.hcmus.edu.vn",
  password: hashedPassword,
  fullname: "Admin",
  username: "admin",
  avatarId: null,
  facebookLink: null,
  githubLink: null,
  createdAt: new Date(),
  admin: true,
};

// JWT tokens for user and admin
export const userToken = jwt.sign(
  { userId: user.userId }, // Payload
  process.env.JWT_SECRET as string, // Secret
  { expiresIn: "3m" }, // Token expiration
);

export const adminToken = jwt.sign(
  { userId: admin.userId }, // Payload
  process.env.JWT_SECRET as string, // Secret
  { expiresIn: "3m" }, // Token expiration
);

// Files for test cases
export const file1: Files = {
  fileId: 1,
  filename: `testcase_1`,
  filesize: 1057,
  fileType: "application/x-zip-compressed",
  url: "https://ojus-bucket-test.sgp1.cdn.digitaloceanspaces.com/testcase.zip",
  key: null,
  createdAt: new Date(),
};

export const file2: Files = {
  fileId: 2,
  filename: `testcase_2`,
  filesize: 1057,
  fileType: "application/x-zip-compressed",
  url: "https://ojus-bucket-test.sgp1.cdn.digitaloceanspaces.com/testcase.zip",
  key: null,
  createdAt: new Date(),
};

export const file3: Files = {
  fileId: 3,
  filename: `testcase_3`,
  filesize: 1057,
  fileType: "application/x-zip-compressed",
  url: "https://ojus-bucket-test.sgp1.cdn.digitaloceanspaces.com/testcase.zip",
  key: null,
  createdAt: new Date(),
};

export const file4: Files = {
  fileId: 4,
  filename: `testcase_4`,
  filesize: 1057,
  fileType: "application/x-zip-compressed",
  url: "https://ojus-bucket-test.sgp1.cdn.digitaloceanspaces.com/testcase.zip",
  key: null,
  createdAt: new Date(),
};

// Problem and contribution data
export const problem1: Problem = {
  problemId: 1,
  title: "Problem 1",
  description: "Description for problem 1",
  status: 2,
  difficulty: 2,
  tags: `Array`,
  timeLimit: 1000,
  memoryLimit: 1000,
  authorId: 1,
  fileId: 1,
  createdAt: new Date(),
  langSolution: "py", // Random language
  tutorial: "This is a tutorial for solving Problem 1. Follow the steps to solve it.", // Random tutorial string
  solution: "def solve():\n    n = int(input())\n    print(-n)", // Random solution code
};

export const problem2: Problem = {
  problemId: 2,
  title: "Problem 2",
  description: "Description for problem 2",
  status: 2,
  difficulty: 3,
  tags: `String`,
  timeLimit: 1000,
  memoryLimit: 1000,
  authorId: 1,
  fileId: 2,
  createdAt: new Date(),
  langSolution: "cpp", // Random language
  tutorial: "This is a tutorial for solving Problem 2. Follow the steps to solve it.", // Random tutorial string
  solution: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -i;\n}", // Random solution code
};

export const contribution1: Problem = {
  problemId: 3,
  title: "Contribution 1",
  description: "Description for problem 1",
  status: 0,
  difficulty: 2,
  tags: `Array`,
  timeLimit: 1000,
  memoryLimit: 1000,
  authorId: 1,
  fileId: 3,
  createdAt: new Date(),
  langSolution: "js", // Random language
  tutorial: "This is a tutorial for Contribution 1. Follow the steps to solve it.", // Random tutorial string
  solution: "process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\n\nprocess.stdin.on('data', (input) => {\n  const n = parseInt(input);\n  console.log(-n);\n  process.exit();\n});", // Random solution code
};

export const contribution2: Problem = {
  problemId: 4,
  title: "Contribution 2",
  description: "Description for problem 2",
  status: 0,
  difficulty: 3,
  tags: `String`,
  timeLimit: 1000,
  memoryLimit: 1000,
  authorId: 1,
  fileId: 4,
  createdAt: new Date(),
  langSolution: "java", // Random language
  tutorial: "This is a tutorial for Contribution 2. Follow the steps to solve it.", // Random tutorial string
  solution: "import java.util.Scanner;\n\nclass Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(-n);\n    }\n}\n", // Random solution code
};

// Submission and result data
export const submission1: Submission = {
  submissionId: 1,
  userId: user.userId,
  createdAt: new Date(),
  problemId: problem1.problemId,
  code: "Dont care",
  language: "py",
  verdict: verdict.OK,
  stderr: "",
};

export const submission2: Submission = {
  submissionId: 2,
  userId: user.userId,
  createdAt: new Date(),
  problemId: problem1.problemId,
  code: "Dont care",
  language: "py",
  verdict: verdict.WRONG_ANSWER,
  stderr: "",
};

export const submission3: Submission = {
  submissionId: 3,
  userId: user.userId,
  createdAt: new Date(),
  problemId: problem2.problemId,
  code: "Dont care",
  language: "py",
  verdict: verdict.OK,
  stderr: "",
};

export const result1: Result = {
  resultId: 1,
  submissionId: submission1.submissionId,
  output: "-1",
  testcaseIndex: 1,
  verdict: verdict.OK,
  time: 100,
  memory: 100,
  createdAt: new Date(),
};

export const result2: Result = {
  resultId: 2,
  submissionId: submission1.submissionId,
  output: "-2",
  testcaseIndex: 2,
  verdict: verdict.OK,
  time: 100,
  memory: 100,
  createdAt: new Date(),
};

// Compile fail answers for testing
export const compileFailAnswer = [
  {
    language: "c",
    invalidCode: '#include "studio.h"',
    validCode: '#include "stdio.h"\n\nint main() {\n  printf("Random");\n}',
  },
  {
    language: "cpp",
    invalidCode: '#include "IOStream"',
    validCode:
      '#include <iostream>\n\nint main() {\n  std::cout << "Random";\n}',
  },
  {
    language: "java",
    invalidCode:
      'class Solution{  \n    public static void main(String args[]){  \n     System.out.println("Random string to test compile error")  \n    }  \n}',
    validCode:
      'class Solution{  \n    public static void main(String args[]){  \n     System.out.println("Hello Java");\n    }  \n}',
  },
];

// Correct answers for different languages
export const correctAnswers = [
  {
    language: "c",
    code: '#include <stdio.h>\n\nint main() {\n  int n;\n  scanf("%d", &n);\n  printf("%d", -n);\n}',
  },
  {
    language: "cpp",
    code: "#include <iostream>\nusing namespace std;\n\nint main() {\n  int i;\n  cin >> i;\n  cout << -i;\n}",
  },
  {
    language: "py",
    code: "import fileinput\n\nfor line in fileinput.input():\n  cur = line.rstrip()\n  print(-int(cur))",
  },
  {
    language: "java",
    code: "import java.util.Scanner;\n\nclass Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(-n);\n    }\n}\n",
  },
  {
    language: "js",
    code: "process.stdin.resume();\nprocess.stdin.setEncoding('utf8');\n\nprocess.stdin.on('data', (input) => {\n  const n = parseInt(input);\n  console.log(-n);\n  process.exit();\n});\n",
  },
];
