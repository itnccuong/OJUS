import { CustomError } from "../../utils/errorClass";
import { downloadTestcase, saveCodeToFile } from "../../utils/general";
import { STATUS_CODE, verdict } from "../../utils/constants";
import prisma from "../../prisma/client";
import { compile, executeAgainstTestcase } from "../../utils/codeExecutorUtils";
import { findProblemById } from "./problem.service";
import fs from "fs/promises";

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

    throw new CustomError(verdict.COMPILE_ERROR, STATUS_CODE.BAD_REQUEST, {
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
): Promise<void> => {
  let testDir: string = "";

  try {
    // 1. Fetch Problem and File Details
    const problem = await findProblemById(problem_id);
    if (!problem) {
      throw new CustomError("Problem not found", STATUS_CODE.NOT_FOUND, { problem_id });
    }

    const file = await findFileById(problem.fileId);
    if (!file) {
      throw new CustomError("File not found", STATUS_CODE.NOT_FOUND, { fileId: problem.fileId });
    }

    const fileUrl = file.url;

    // 2. Download and Extract Testcases
    const { testcase, testDir: downloadedTestDir } = await downloadTestcase(fileUrl);
    testDir = downloadedTestDir; // Assign to outer scope for cleanup

    // 3. Execute Code Against Each Testcase
    const testcaseLength = testcase.input.length;
    for (let index = 0; index < testcaseLength; ++index) {
      const input = testcase.input[index];
      const expectedOutput = testcase.output[index];

      const result = await executeAgainstTestcase(
        filename,
        input,
        expectedOutput,
        language,
        problem.timeLimit,
      );

      await createResult(
        submissionId,
        index,
        result.stdout,
        result.verdict,
        result.time,
        0, // Assuming '0' represents no memory usage or similar
      );

      if (result.verdict !== verdict.OK) {
        await updateSubmissionVerdict(
          submissionId,
          result.verdict,
          result.stderr,
        );

        // Optionally, you can record additional details like memory usage, etc.

        throw new CustomError(result.verdict, STATUS_CODE.BAD_REQUEST, {
          submissionId: submissionId,
        });
      }
    }

    // 4. Update Submission as Successful if All Testcases Passed
    await updateSubmissionVerdict(
      submissionId,
      verdict.OK,
      "", // Assuming no stderr for successful verdict
    );

  } finally {
    // 5. Cleanup: Delete the Test Directory
    if (testDir) {
      try {
        await fs.rm(testDir, { recursive: true, force: true });
        console.log(`Deleted test directory at ${testDir}`);
      } catch (deleteError) {
        console.error(`Failed to delete test directory at ${testDir}:`, deleteError);
        // Optionally, emit a warning or log it for further inspection
      }
    }
  }
};

