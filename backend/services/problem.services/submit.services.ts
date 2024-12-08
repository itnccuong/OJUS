import { CustomError } from "../../utils/error";
import { codeDirectory, languageDetails } from "./code-executor/executor-utils";
import fs, { readFileSync } from "fs";
import axios from "axios";
import AdmZip from "adm-zip";

import path from "path";
import { parseFilename } from "../../utils/general";
import { STATUS_CODE } from "../../utils/constants";
import {
  ContainerConfig,
  TestcaseInterface,
} from "../../interfaces/code-executor-interface";
import prisma from "../../prisma/client";

export const createSubmission = async (
  problem_id: number,
  userId: number,
  code: string,
  language: string,
) => {
  const submission = await prisma.submission.create({
    data: {
      problemId: problem_id,
      userId: userId!,
      code: code,
      language: language,
      verdict: "",
    },
  });
  return submission;
};

export const findProblemById = async (problem_id: number) => {
  const problem = await prisma.problem.findUnique({
    where: {
      problemId: problem_id,
    },
  });
  if (!problem) {
    // throw new FindByIdError("Problem not found", problem_id, "Problem");
    throw new CustomError(
      "PROBLEM_NOT_FOUND",
      "Problem not found in database!",
      STATUS_CODE.NOT_FOUND,
      {
        problemId: problem_id,
      },
    );
  }
  return problem;
};

export const getContainerId = (container: ContainerConfig) => {
  const containerId = container.id;

  if (!containerId) {
    throw new CustomError(
      "NOT_FOUND",
      "Container id not found",
      STATUS_CODE.BAD_REQUEST,
      {},
    );
  }
  return containerId;
};

export const findFileById = async (fileId: number) => {
  const file = await prisma.files.findUnique({
    where: {
      fileId: fileId,
    },
  });
  if (!file) {
    throw new CustomError(
      "FILE_NOT_FOUND",
      "File not found in database!",
      STATUS_CODE.NOT_FOUND,
      {
        fileId: fileId,
      },
    );
  }
  return file;
};

export const downloadTestcase = async (fileUrl: string) => {
  //Get file's name from url. Example: http://myDir/abc.cpp -> abc.cpp
  const filename = fileUrl.replace(/^.*[\\/]/, "");
  const testsDir = path.join(__dirname, "testcases");
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir);
  }

  const testDir = path.join(testsDir, filename);
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir);
  }
  const zipPath = path.join(testDir, "testcase.zip");
  const extractedPath = path.join(testDir, "extracted");

  //Download the ZIP file
  const response = await axios.get(fileUrl, {
    responseType: "stream",
  });

  const writer = fs.createWriteStream(zipPath);
  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });

  //Unzip the file
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(extractedPath, true);

  const testcase: TestcaseInterface = { input: [], output: [] };
  const files = fs.readdirSync(extractedPath, "utf8");
  files.forEach((fileName: string) => {
    const filePath = path.join(extractedPath, fileName);
    const parsedFilename = parseFilename(fileName);
    const file = readFileSync(filePath, "utf-8");
    if (parsedFilename.type === "input") {
      testcase["input"][parsedFilename.number - 1] = file;
    }
    if (parsedFilename.type === "output") {
      testcase.output[parsedFilename.number - 1] = file;
    }
  });
  return testcase;
};

//Create new file in codeFiles directory from submitted code
export const saveCodeToFile = (
  submissionId: number,
  code: string,
  language: string,
) => {
  //Use submissionId to generate unique filename
  const filename = `${submissionId}.${language}`;

  const filePath = path.join("codeFiles", filename);
  fs.writeFileSync(filePath, code, { encoding: "utf-8" });
  return filename;
};

export const updateSubmissionVerdict = async (
  submissionId: number,
  verdict: string,
) => {
  const submission = await prisma.submission.update({
    where: {
      submissionId: submissionId,
    },
    data: {
      verdict: verdict,
    },
  });
  return submission;
};

export const createResult = async (
  submissionId: number,
  testcaseIndex: number,
  output: string,
  verdict: string,
  time: number,
  memory: number,
) => {
  await prisma.result.create({
    data: {
      submissionId: submissionId,
      testcaseIndex: testcaseIndex,
      output: output,
      verdict: verdict,
      time: time,
      memory: memory,
    },
  });
};

export const updateUserProblemStatus = async (
  userId: number,
  problemId: number,
) => {
  await prisma.userProblemStatus.upsert({
    where: {
      userId_problemId: {
        userId: userId,
        problemId: problemId,
      },
    },
    update: {}, // Leave empty if you don't want to update existing records
    create: {
      userId: userId,
      problemId: problemId,
    },
  });
};
