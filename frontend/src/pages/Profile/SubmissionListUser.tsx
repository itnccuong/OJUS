import { useNavigate } from "react-router-dom";

import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import getToken from "../../utils/getToken.ts";
import axiosInstance from "../../utils/axiosInstance.ts";
import {
  ResponseInterface,
  SubmissionWithProblem,
} from "../../interfaces/interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import {
  difficultyMapping,
  language_BE_to_FE_map,
  verdictMap,
} from "../../utils/constanst.ts";
import { shortReadableTimeConverter } from "../../utils/general.ts";

export default function SubmissionListUser() {
  const token = getToken(); // Get token from localStorage
  const [fetchSubmissions, setFetchSubmissions] = useState<
    SubmissionWithProblem[]
  >([]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      toast.error("You need to login to view submission");
      navigate("/accounts/login");
    }
  }, [token, navigate]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get<
          ResponseInterface<{ submissions: SubmissionWithProblem[] }>
        >(`/api/user/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);
        setFetchSubmissions(res.data.data.submissions);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            // toast.error("You need to log to view submissions");
          } else {
            const errorMessage = error.response?.data?.message;
            toast.error(errorMessage);
          }
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) {
    return <Loader />;
  }

  const submissions = fetchSubmissions.map((fetchSubmission) => {
    return {
      ...fetchSubmission,
      problem: {
        ...fetchSubmission.problem,
        difficulty: difficultyMapping[fetchSubmission.problem.difficulty],
      },
      verdict: verdictMap[fetchSubmission.verdict],
      language: language_BE_to_FE_map[fetchSubmission.language],
      createdAt: shortReadableTimeConverter(fetchSubmission.createdAt),
    };
  });

  return (
    <div className="d-flex flex-grow-1 px-5 py-4 bg-body-tertiary">
      <div className="container-xxl d-flex">
        <div className="p-4 border rounded-4 round shadow-sm bg-white w-100">
          <h4 className="mb-4">All My Submissions</h4>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th
                  className="text-center"
                  style={{
                    width: "30%",
                  }}
                >
                  Title
                </th>
                <th className="text-center" style={{ width: "15%" }}>
                  Difficulty
                </th>
                <th className="text-center" style={{ width: "15%" }}>
                  Language
                </th>
                <th className="text-center" style={{ width: "15%" }}>
                  Verdict
                </th>
                <th className="text-center">Submit time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr
                  key={submission.submissionId}
                  onClick={() =>
                    navigate(`/submissions/${submission.submissionId}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-center">{submission.problem.title}</td>

                  <td className="text-center">
                    <span
                      className={`badge fs-6 ${
                        submission.problem.difficulty === "Bronze"
                          ? "text-warning-emphasis"
                          : submission.problem.difficulty === "Platinum"
                            ? "text-primary"
                            : "text-danger"
                      }`}
                    >
                      {submission.problem.difficulty}
                    </span>
                  </td>

                  {/*Language*/}
                  <td className="text-center">{submission.language}</td>
                  <td className="text-center">
                    <span
                      className={
                        submission.verdict === "Accepted"
                          ? "badge text-success"
                          : "badge text-danger"
                      }
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {submission.verdict}
                    </span>
                  </td>

                  <td className="text-center">{submission.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
