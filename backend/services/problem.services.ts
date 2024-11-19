import { PrismaClient } from "@prisma/client";
import {
  ConvertLanguageError,
  FindProblemByIdError,
  FindTestByProblemIdError,
  GetContainerIdError,
} from "../utils/error";
import { languageDetails } from "./code-executor/executor-utils";
import { ContainerConfig } from "../interfaces/code-executor-interface";

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
