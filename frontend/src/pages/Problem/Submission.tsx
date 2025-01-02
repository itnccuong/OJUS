import { Link, useParams } from "react-router-dom";

import {
  ProblemInterface,
  ResultInterface,
  SubmissionInterface,
  TestcaseInterface,
} from "../../interfaces/interface.ts";
import Loader from "../../components/Loader.tsx";
import Editor from "@monaco-editor/react";
import {
  language_BE_to_FE_map,
  languageEditorMap,
  verdict,
  verdictMap,
} from "../../utils/constanst.ts";
import { shortReadableTimeConverter } from "../../utils/general.ts";
import useFetch from "../../hooks/useFetch.ts";

export default function Submission() {
  const { submissionId } = useParams();

  const { data: fetchSubmission, loading: submissionLoading } = useFetch<{
    submission: SubmissionInterface;
  }>(`/api/submissions/${submissionId}`);
  let submission = fetchSubmission?.data.submission;

  const { data: fetchProblem, loading: problemLoading } = useFetch<{
    problem: ProblemInterface;
  }>(`/api/problems/${submission?.problemId}`, {
    skip: !submission,
  });
  const problem = fetchProblem?.data.problem;

  const { data: fetchResults, loading: resultsLoading } = useFetch<{
    results: ResultInterface[];
  }>(`/api/submissions/${submissionId}/results`);
  const results = fetchResults?.data.results;

  const { data: fetchTestcases, loading: testcasesLoading } = useFetch<{
    testcases: TestcaseInterface;
  }>(`/api/problems/${submission?.problemId}/testcases`, {
    skip: !submission,
  });
  const testcases = fetchTestcases?.data.testcases;
  if (
    submissionLoading ||
    problemLoading ||
    resultsLoading ||
    testcasesLoading ||
    !submission ||
    !problem ||
    !results ||
    !testcases
  ) {
    return <Loader />;
  }

  submission = {
    ...submission,
    language: language_BE_to_FE_map[submission.language],
    verdict: verdictMap[submission.verdict],
    createdAt: shortReadableTimeConverter(submission.createdAt),
  };

  const maxTime = Math.max(0, ...results.map((result) => result.time));
  const totalMemory = results.reduce((sum, result) => sum + result.memory, 0);

  return (
    <div className="d-flex flex-grow-1 px-5 py-4">
      <div className="container-xxl d-flex flex-column">
        <h4 className="text-primary">
          <Link
            to={
              problem.status === 2
                ? `/problems/${submission.problemId}/description`
                : `/contributions/${submission.problemId}/description`
            }
            style={{
              textDecoration: "none",
            }}
          >
            {problem.title}
          </Link>
        </h4>
        <h3 className="mt-4">Submission Detail</h3>
        <div className="border border-dark-subtle shadow-sm rounded-4 p-3 mt-3">
          <div className="d-flex justify-content-between">
            <div>
              <div className="mb-2">
                <span className="fw-bold">
                  {submission.verdict === verdict.AC
                    ? `${testcases.input.length}`
                    : submission.verdict === verdict.CE
                      ? "0"
                      : `${results.length - 1}`}
                  /{testcases.input.length}
                </span>
                <span> test cases passed</span>
              </div>
              <div>
                <span>Runtime: </span>
                <span className="fw-bold">{maxTime} ms</span>
              </div>
              <div>
                <span>Memory: </span>
                <span className="fw-bold">{totalMemory} MB</span>
              </div>
            </div>
            <div>
              <div className="mb-2">
                <span>Verdict:</span>
                <span
                  className={
                    submission.verdict === verdict.AC
                      ? "badge text-success"
                      : "badge text-danger"
                  }
                  style={{
                    fontSize: "18px",
                  }}
                >
                  {submission.verdict}
                </span>
              </div>
              <div>
                <span>Submitted: </span>
                <span className="fw-bold">{submission.createdAt}</span>
              </div>
              <div>
                <span>Language: </span>
                <span className="fw-bold">{submission.language}</span>
              </div>
            </div>
          </div>
        </div>
        {/*Log err*/}
        {(submission.stderr || submission.verdict === verdict.WA) && (
          <div className="border border-danger shadow-sm rounded-4 p-3 mt-3">
            {submission.stderr ? (
              <div className="text-danger fw-medium">{submission.stderr}</div>
            ) : submission.verdict === verdict.WA ? (
              <>
                <div className="border-bottom border-danger pb-3">
                  <span className="text-danger fw-medium">Input: </span>
                  <span className="fw-bold">
                    {testcases.input[results.length - 1]}
                  </span>
                </div>
                <div className="border-bottom border-danger pb-3 pt-3">
                  <span className="text-danger fw-medium">Expected: </span>
                  <span className="fw-bold text-success">
                    {testcases.output[results.length - 1]}
                  </span>
                </div>
                <div className="pt-3">
                  <span className="text-danger fw-medium">Output: </span>
                  <span className="fw-bold text-danger">
                    {results[results.length - 1].output}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        )}

        <h4 className="mt-3">Solution</h4>
        <div
          className="border border-dark-subtle shadow-sm rounded-4 mt-3"
          style={{
            height: "40vh",
          }}
        >
          <div className="mt-3 mb-3">
            <Editor
              height="35vh"
              language={languageEditorMap[submission.language]}
              value={submission.code}
              // theme={"github"}
              options={{
                minimap: { enabled: false },
                readOnly: true,
                scrollbar: { vertical: "hidden", horizontal: "hidden" },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
