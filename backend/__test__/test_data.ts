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

//Testcase
// input1   1
// output1 -1
// input2   2
// output2 -2
// input3   3
// output3 -3
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
  memoryLimit: 100,
  authorId: 1,
  fileId: 1,
};
export let fake_token = "";
