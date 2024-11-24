import { PrismaClient } from "@prisma/client";
import { CustomError } from "../utils/error";
import { languageDetails } from "./code-executor/executor-utils";
import fs, { readFileSync } from "fs";
import axios from "axios";
import AdmZip from "adm-zip";

import path from "path";
import { parseFilename } from "../utils/general";
import { STATUS_CODE } from "../utils/constants";
import {
  ContainerConfig,
  TestcaseInterface,
} from "../interfaces/code-executor-interface";
import prisma from "../prisma/client";

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

//Convert language string from frontend to match backend
export const convertLanguage = (language: string) => {
  const convertMap: Record<string, string> = {
    Python: "py",
    "C++": "cpp",
    C: "c",
    Java: "java",
    Javascript: "js",
  };

  const convertedLanguage = convertMap[language];
  if (!languageDetails[convertedLanguage]) {
    // throw new ConvertLanguageError("Invalid language", language);
  }
  return convertedLanguage;
};

export const getContainerId = (container: ContainerConfig) => {
  const containerId = container.id;
  if (!containerId) {
    // throw new GetContainerIdError("Fail to get container id");
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
