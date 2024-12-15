import prisma from "../../prisma/client";
import { verdict } from "../../utils/constants";
import { Submission } from "@prisma/client";
import { findResultBySubmissionId } from "../submission.services/submission.service";

export const queryProblems = async () => {
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
      problemId: problem_id,
      userId: userId,
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
