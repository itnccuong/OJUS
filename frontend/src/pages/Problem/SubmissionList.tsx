import { Link, useNavigate, useParams } from "react-router-dom";

import NavBar from "../../components/NavBar.tsx";
import { Button, OverlayTrigger, Popover, Table } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";

import { toast } from "react-toastify";
import getToken from "../../../utils/getToken.ts";
import {
  OneProblemResponseInterface,
  ResponseInterface,
} from "../../../interfaces/response.interface.ts";
import axiosInstance from "../../../utils/getURL.ts";
import { ProblemWithUserStatusInterface } from "../../../interfaces/model.interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import Footer from "../../components/Footer.tsx";

export default function SubmissionList() {
  const { id } = useParams();
  const token = getToken(); // Get token from localStorage
  const [fetchProblem, setFetchProblem] =
    useState<ProblemWithUserStatusInterface>();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (!token) {
          res = await axiosInstance.get<
            ResponseInterface<OneProblemResponseInterface>
          >(`/api/problems/no-account/${id}`, {});
        } else {
          res = await axiosInstance.get<
            ResponseInterface<OneProblemResponseInterface>
          >(`/api/problems/with-account/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        console.log(res.data);
        setFetchProblem(res.data.data.problem);
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

  if (loading || !fetchProblem) {
    return <Loader />;
  }

  type Submission = {
    submissionId: number;
    language: string;
    verdict: string;
    createdAt: string;
  };

  const submissions: Submission[] = [
    {
      submissionId: 1,
      language: "Python",
      verdict: "Accepted",
      createdAt: "2024-12-12T10:15:30Z",
    },
    {
      submissionId: 2,
      language: "C++",
      verdict: "Wrong Answer on test 2",
      createdAt: "2024-12-12T10:20:15Z",
    },
    {
      submissionId: 3,
      language: "Java",
      verdict: "Time Limit Exceeded on test 4",
      createdAt: "2024-12-12T10:25:45Z",
    },
    {
      submissionId: 4,
      language: "Python",
      verdict: "Runtime Error on test 3",
      createdAt: "2024-12-12T10:30:05Z",
    },
    {
      submissionId: 5,
      language: "JavaScript",
      verdict: "Accepted",
      createdAt: "2024-12-12T10:35:50Z",
    },
  ];

  return (
    <div className="d-flex-flex-column">
      <NavBar />

      <div className="bg-light p-3">
        <div className="container">
          <div
            className="d-flex justify-content-between gap-2"
            style={{ minHeight: "83vh" }}
          >
            <div className="container p-3 border rounded-4 round shadow-sm bg-white">
              <div className="d-flex gap-2 mb-3">
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/problems/${id}/description`)}
                >
                  Description
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/problems/${id}/submissions`)}
                >
                  Submission
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
                    <th className="text-center" style={{ width: "35%" }}>
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
                      <td className="text-center">{submission.verdict}</td>

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
