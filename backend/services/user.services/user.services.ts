import prisma from "../../prisma/client";
import { Submission } from "@prisma/client";
import { findResultBySubmissionId } from "../submission.services/submission.service";
import { findProblemById } from "../problem.services/submit.services";
import { verdict } from "../../utils/constants";

export const findSubmissionsUser = async (userId: number) => {
  const submissions = await prisma.submission.findMany({
    where: {
      userId,
    },
  });
  return submissions;
};

export const addProblemToSubmissions = async (submissions: Submission[]) => {
  const submissionsWithProblem = await Promise.all(
    submissions.map(async (submission) => {
      const problem = await findProblemById(submission.problemId);
      return {
        ...submission,
        problem: problem,
      };
    }),
  );
  return submissionsWithProblem;
};

export const filterSubmissionsAC = async (submissions: Submission[]) => {
  const submissionsFilteredAC = submissions.filter(
    (submission) => submission.verdict === verdict.OK,
  );
  return submissionsFilteredAC;
};
