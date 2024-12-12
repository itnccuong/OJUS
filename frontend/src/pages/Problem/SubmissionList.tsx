import { Link, useNavigate, useParams } from "react-router-dom";

import NavBar from "../../components/NavBar.tsx";
import { Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import getToken from "../../../utils/getToken.ts";
import {
  ResponseInterface,
  SubmissionListResponseInterface,
} from "../../../interfaces/response.interface.ts";
import axiosInstance from "../../../utils/getURL.ts";
import { SubmissionInterface } from "../../../interfaces/model.interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import Footer from "../../components/Footer.tsx";

export default function SubmissionList() {
  const { problemId } = useParams();
  const token = getToken(); // Get token from localStorage
  const [fetchSubmissions, setFetchSubmissions] = useState<
    SubmissionInterface[]
  >([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get<
          ResponseInterface<SubmissionListResponseInterface>
        >(`/api/problems/${problemId}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);
        setFetchSubmissions(res.data.data.submissions);
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

  if (loading || !fetchSubmissions) {
    return <Loader />;
  }

  const submissions = fetchSubmissions.map((fetchSubmission) => {
    const languageMap: Record<string, string> = {
      py: "Python",
      c: "C",
      cpp: "C++",
      java: "Java",
      js: "JavaScript",
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
      weekday: "long", // e.g., "Friday"
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "December"
      day: "numeric", // e.g., "6"
      hour: "numeric", // e.g., "8 AM"
      minute: "numeric", // e.g., "57"
      second: "numeric", // e.g., "20"
      hour12: true, // 12-hour clock (AM/PM)
    });

    return {
      ...fetchSubmission,
      language: languageMap[fetchSubmission.language],
      verdict: verdictMap[fetchSubmission.verdict],
      createdAt: readableTime,
    };
  });

  return (
    <div className="d-flex-flex-column">
      <NavBar />

      <div className="bg-light p-3">
        <div className="container">
          <div
            className="d-flex justify-content-between gap-2"
            style={{ minHeight: "83vh" }}
          >
            <div className="container p-4 border rounded-4 round shadow-sm bg-white">
              <div className="d-flex gap-2 mb-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/problems/${problemId}/description`)}
                >
                  Description
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/problems/${problemId}/submissions`)}
                >
                  Submissions
                </Button>
              </div>
              <Table striped bordered hover className="mt-3">
                <thead>
                  <tr>
                    {/* <div className="d-flex"> */}
                    <th
                      className="text-center"
                      style={{
                        width: "8%",
                      }}
                    >
                      ID
                    </th>
                    <th className="text-center" style={{ width: "20%" }}>
                      Language
                    </th>
                    {/* </div> */}
                    <th className="text-center" style={{ width: "30%" }}>
                      Verdict
                    </th>
                    <th className="text-center">Submit time</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission) => (
                    <tr
                      key={submission.submissionId}
                      onClick={() => console.log("okok")}
                      style={{ cursor: "pointer" }}
                    >
                      {/*Submission id*/}
                      <td className="text-center">
                        <Link
                          to={`/submissions/${submission.submissionId}`}
                          style={{
                            textDecoration: "none",
                            color: "black",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "blue")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color = "black")
                          }
                        >
                          {submission.submissionId}
                        </Link>
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
      </div>
      <Footer />
    </div>
  );
}
