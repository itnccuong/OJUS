import { Link, useParams } from "react-router-dom";

import NavBar from "../../components/NavBar.tsx";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import {
  GetResultsResponseInterface,
  GetSubmissionResponseInterface,
  GetTestcasesResponseInterface,
  OneProblemResponseInterface,
  ResponseInterface,
} from "../../../interfaces/response.interface.ts";
import axiosInstance from "../../../utils/getURL.ts";
import {
  ProblemInterface,
  ResultInterface,
  SubmissionInterface,
  TestcaseInterface,
} from "../../../interfaces/model.interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import Footer from "../../components/Footer.tsx";
import Editor from "@monaco-editor/react";

export default function Submission() {
  const { submissionId } = useParams();
  const [fetchSubmission, setFetchSubmission] = useState<SubmissionInterface>();
  const [results, setResults] = useState<ResultInterface[]>([]);
  const [testcases, setTestcases] = useState<TestcaseInterface>();
  const [problem, setProblem] = useState<ProblemInterface>();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        //Fetch submission
        const resSubmission = await axiosInstance.get<
          ResponseInterface<GetSubmissionResponseInterface>
        >(`/api/submissions/${submissionId}`);

        setFetchSubmission(resSubmission.data.data.submission);
        console.log("Submission", resSubmission.data.data.submission);

        //Fetch problem
        const resProblem = await axiosInstance.get<
          ResponseInterface<OneProblemResponseInterface>
        >(
          `/api/problems/no-account/${resSubmission.data.data.submission.problemId}`,
        );
        setProblem(resProblem.data.data.problem);
        console.log("Problem", resProblem.data.data.problem);

        //Fetch results
        const resResults = await axiosInstance.get<
          ResponseInterface<GetResultsResponseInterface>
        >(`/api/submissions/${submissionId}/results`);
        setResults(resResults.data.data.results);
        console.log("Results", resResults.data.data.results);

        //Fetch testcases
        const resTestcases = await axiosInstance.get<
          ResponseInterface<GetTestcasesResponseInterface>
        >(
          `/api/problems/${resSubmission.data.data.submission.problemId}/testcases`,
        );
        setTestcases(resTestcases.data.data.testcases);
        console.log("Testcases", resTestcases.data.data.testcases);
      } catch (error) {
        if (error instanceof AxiosError) {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !fetchSubmission || !problem || !testcases) {
    return <Loader />;
  }

  const languageMap: Record<string, string> = {
    py: "Python",
    c: "C",
    cpp: "C++",
    java: "Java",
    js: "JavaScript",
  };

  const languageMapEditor: Record<string, string> = {
    Python: "python",
    C: "c",
    "C++": "cpp",
    Java: "java",
    JavaScript: "javascript",
  };

  const verdictMap: Record<string, string> = {
    OK: "Accepted",
    WRONG_ANSWER: "Wrong Answer",
    TIME_LIMIT_EXCEEDED: "Time Limit Exceeded",
    RUNTIME_ERROR: "Runtime Error",
    COMPILE_ERROR: "Compile Error",
  };

  const date = new Date(fetchSubmission.createdAt);

  const readableTime = date.toLocaleString("en-US", {
    year: "numeric", // e.g., "2024"
    month: "long", // e.g., "December"
    day: "numeric", // e.g., "6"
  });

  const submission = {
    ...fetchSubmission,
    language: languageMap[fetchSubmission.language],
    verdict: verdictMap[fetchSubmission.verdict],
    createdAt: readableTime,
  };

  // const totalTime = results.reduce((sum, result) => sum + result.time, 0);
  const maxTime = Math.max(0, ...results.map((result) => result.time));
  const totalMemory = results.reduce((sum, result) => sum + result.memory, 0);

  return (
    console.log(results),
    (
      <div className="d-flex-flex-column">
        <NavBar />

        <div className="p-3">
          <div
            className="container"
            style={{
              minHeight: "83vh",
            }}
          >
            <h4 className="text-primary">
              <Link
                to={`/problems/${submission.problemId}/description`}
                style={{
                  textDecoration: "none",
                }}
              >
                {problem.title}
              </Link>
            </h4>
            <h3 className="mt-4">Submission Detail</h3>
            <div className="container border border-dark-subtle shadow-sm rounded-4 p-3 mt-3">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="mb-2">
                    <span className="fw-bold">
                      {submission.verdict === "Accepted"
                        ? `${testcases.input.length}`
                        : submission.verdict === "Compile Error"
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
                        submission.verdict === "Accepted"
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
            {(submission.stderr || submission.verdict === "Wrong Answer") && (
              <div className="container border border-danger shadow-sm rounded-4 p-3 mt-3">
                {submission.stderr ? (
                  <div className="text-danger fw-medium">
                    {submission.stderr}
                  </div>
                ) : submission.verdict === "Wrong Answer" ? (
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

            <h4 className="mt-3">Code</h4>
            <div
              className="border border-dark-subtle shadow-sm rounded-4 mt-3"
              style={{
                height: "40vh",
              }}
            >
              <div className="mt-3 mb-3">
                <Editor
                  height="35vh"
                  language={languageMapEditor[submission.language]}
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
        <Footer />
      </div>
    )
  );
}
