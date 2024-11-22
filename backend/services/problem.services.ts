import { PrismaClient } from "@prisma/client";
import {
  ConvertLanguageError,
  FindProblemByIdError,
  FindTestByProblemIdError,
  GetContainerIdError,
} from "../utils/error";
import { languageDetails } from "./code-executor/executor-utils";
import { ContainerConfig, testcaseInterface } from "../interfaces";
import fs, { readFileSync } from "fs";
import axios from "axios";
import AdmZip from "adm-zip";

import path from "path";
import { parseFilename } from "../utils/general";

const prisma = new PrismaClient();

export const findTestsByProblemId = async (problem_id: number) => {
  const testcases = await prisma.testCase.findMany({
    where: {
      problemId: problem_id,
    },
  });
  if (!testcases.length) {
    throw new FindTestByProblemIdError("Testcase not found", problem_id);
  }
  return testcases;
};

export const findProblemById = async (problem_id: number) => {
  const problem = await prisma.problem.findUnique({
    where: {
      problemId: problem_id,
    },
  });
  if (!problem) {
    throw new FindProblemByIdError("Problem not found", problem_id);
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
    throw new ConvertLanguageError("Invalid language", language);
  }
  return convertedLanguage;
};

export const getContainerId = (container: ContainerConfig) => {
  const containerId = container.id;
  if (!containerId) {
    throw new GetContainerIdError("Fail to get container id");
  }
  return containerId;
};

export const downloadTestcase = async (fileUrl: string) => {
  //Get file's name from url. Example: http://myDir/abc.cpp -> abc.cpp
  const filename = fileUrl.replace(/^.*[\\/]/, "");

  const dirPath = path.join(__dirname, filename);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  const zipPath = path.join(dirPath, "testcase.zip");
  const extractedPath = path.join(dirPath, "extracted");

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

  const testcase: testcaseInterface = { input: [], output: [] };
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
