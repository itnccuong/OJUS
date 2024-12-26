import { CustomError } from "../../utils/errorClass";
import { downloadTestcase, saveCodeToFile } from "../../utils/general";
import { STATUS_CODE, verdict } from "../../utils/constants";
import prisma from "../../prisma/client";
import { compile, executeAgainstTestcase } from "../../utils/codeExecutorUtils";
import { findProblemById } from "./problem.service";

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
      stderr: "",
    },
  });
  return submission;
};

export const findFileById = async (fileId: number) => {
  const file = await prisma.files.findUnique({
    where: {
      fileId: fileId,
    },
  });
  if (!file) {
    throw new CustomError("File not found in database!", STATUS_CODE.NOT_FOUND);
  }
  return file;
};

export const compileService = async (
  code: string,
  language: string,
  submissionId: number,
) => {
  const filenameWithExtension = saveCodeToFile(submissionId, code, language);

  const compileResult = await compile(filenameWithExtension, language);
  if (compileResult.stderr) {
    await updateSubmissionVerdict(
      submissionId,
      "COMPILE_ERROR",
      compileResult.stderr,
    );

    throw new CustomError("Compile error", STATUS_CODE.BAD_REQUEST, {
      submissionId: submissionId,
    });
  }

  return compileResult.filenameWithoutExtension;
};

export const updateSubmissionVerdict = async (
  submissionId: number,
  verdict: string,
  stderr: string,
) => {
  await prisma.submission.update({
    where: {
      submissionId: submissionId,
    },
    data: {
      verdict: verdict,
      stderr: stderr,
    },
  });
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

export const executeCodeService = async (
  filename: string,
  language: string,
  submissionId: number,
  problem_id: number,
) => {
  const problem = await findProblemById(problem_id);
  const file = await findFileById(problem.fileId);
  const fileUrl = file.url;
  const testcases = await downloadTestcase(fileUrl);

  const testcaseLength = testcases.input.length;
  for (let index = 0; index < testcaseLength; ++index) {
    const result = await executeAgainstTestcase(
      filename,
      testcases.input[index],
      testcases.output[index],
      language,
      problem.timeLimit,
    );

    await createResult(
      submissionId,
      index,
      result.stdout,
      result.verdict,
      result.time,
      0,
    );

    if (result.verdict !== verdict.OK) {
      await updateSubmissionVerdict(
        submissionId,
        result.verdict,
        result.stderr,
      );

      throw new CustomError(result.verdict, STATUS_CODE.BAD_REQUEST, {
        submissionId: submissionId,
      });
    }
  }
};
