import { UserConfig } from "../interfaces/api-interface";

export const registerData: UserConfig = {
  userId: 1,
  email: "hienvuongnhat@gmail.com",
  username: "hien",
  password: "1",
  fullname: "Hien",
};

interface FileConfig {
  fileId: number;
  filename: string;
  filesize: number;
  fileType: string;
  location: string;
}

export const fileData: FileConfig = {
  fileId: 1,
  filename: "testcase_1732092562978",
  filesize: 1057,
  fileType: "application/x-zip-compressed",
  location:
    "https://hien-leetcode-test.s3.ap-southeast-2.amazonaws.com/64164fde-9909-4777-845a-f6df3eb31cb1%2Ftestcases.zip",
};
export const problemData = {
  problemId: 1,
  title: "1",
  description: "1",
  isActive: true,
  difficulty: 1,
  tags: "1",
  timeLimit: 1000,
  memoryLimit: 1000,
  authorId: 1,
  fileId: 1,
};

export const compileTestCases = [
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
