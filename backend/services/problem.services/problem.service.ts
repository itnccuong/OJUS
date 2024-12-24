import prisma from "../../prisma/client";
import { STATUS_CODE, verdict } from "../../utils/constants";
import { Submission } from "@prisma/client";
import { findResultBySubmissionId } from "../submission.services/submission.service";
import { CustomError } from "../../utils/errorClass";

export const findAcceptedProblems = async () => {
  const problems = await prisma.problem.findMany({
    where: {
      status: 2,
    },
  });

  const res = problems.map((problem) => ({
    ...problem,
    userStatus: false,
  }));
  return res;
};

export const queryProblemStatus = async (userId: number) => {
  const problems = await prisma.problem.findMany({
    where: {
      status: 2,
    },
  });
  const problemsWithStatus = await Promise.all(
    problems.map(async (problem) => {
      const submission = await prisma.submission.findMany({
        where: {
          userId: userId,
          problemId: problem.problemId,
        },
      });
      let userStatus = false;
      //If at least one submission is correct, return true
      if (submission.some((sub) => sub.verdict === verdict.OK)) {
        userStatus = true;
      }
      return {
        ...problem,
        userStatus: userStatus,
      };
    }),
  );

  return problemsWithStatus;
};

export const findProblemById = async (problem_id: number) => {
  const problem = await prisma.problem.findUnique({
    where: {
      problemId: problem_id,
    },
  });
  if (!problem) {
    throw new CustomError(
      "Problem not found in database!",
      STATUS_CODE.NOT_FOUND,
    );
  }
  return problem;
};

export const findAcceptedProblemById = async (problem_id: number) => {
  const problem = await prisma.problem.findUnique({
    where: {
      problemId: problem_id,
      status: 2,
    },
  });
  if (!problem) {
    throw new CustomError(
      "Problem not found in database!",
      STATUS_CODE.NOT_FOUND,
    );
  }
  return problem;
};

export const getUserStatus = async (userId: number, problemId: number) => {
  const submission = await prisma.submission.findMany({
    where: {
      userId: userId,
      problemId: problemId,
    },
  });
  let userStatus = false;
  //If at least one submission is correct, return true
  if (submission.some((sub) => sub.verdict === verdict.OK)) {
    userStatus = true;
  }
  return {
    userStatus: userStatus,
  };
};

export const findSubmissionsProblem = async (
  problem_id: number,
  userId: number,
) => {
  const submissions = await prisma.submission.findMany({
    where: {
      userId,
      problemId: problem_id,
      problem: {
        status: 2,
      },
    },
    include: {
      problem: true, // This joins with the problems table
    },
    orderBy: {
      submissionId: "desc",
    },
  });
  return submissions;
};

export const addResultsToSubmissions = async (submissions: Submission[]) => {
  const submissionsWithResults = await Promise.all(
    submissions.map(async (submission) => {
      const results = await findResultBySubmissionId(submission.submissionId);
      return {
        ...submission,
        results: results,
      };
    }),
  );
  return submissionsWithResults;
};
