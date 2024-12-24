import { useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import getToken from "../../utils/getToken.ts";
import axiosInstance from "../../utils/axiosInstance.ts";
import {
  ResponseInterface,
  SubmissionWithResults,
} from "../../interfaces/interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import ContributionNav from "../../components/ContributionNav.tsx";
import { language_BE_to_FE_map, verdictMap } from "../../utils/constanst.ts";

export default function SubmissionListContribution() {
  const { problemId } = useParams();
  const token = getToken(); // Get token from localStorage
  const [fetchSubmissions, setFetchSubmissions] = useState<
    SubmissionWithResults[]
  >([]);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get<
          ResponseInterface<{ submissions: SubmissionWithResults[] }>
        >(`/api/contributions/${problemId}/submissions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);
        setFetchSubmissions(res.data.data.submissions);
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error("You need to login to view submissions");
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
  }, []);

  if (loading) {
    return <Loader />;
  }

  const submissions = fetchSubmissions.map((fetchSubmission) => {
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
      language: language_BE_to_FE_map[fetchSubmission.language],
      verdict: verdictMap[fetchSubmission.verdict],
      createdAt: readableTime,
    };
  });

  return (
    <div className="d-flex flex-grow-1 px-5 py-4 bg-body-tertiary">
      <div className="container-xxl d-flex">
        <div className="p-4 border rounded-4 round shadow-sm bg-white w-100">
          <ContributionNav problemId={problemId as string} />
          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
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
                  onClick={() =>
                    navigate(`/submissions/${submission.submissionId}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  {/*Submission id*/}
                  <td className="text-center">{submission.submissionId}</td>

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
                      {submission.verdict === "Wrong answer" ||
                      submission.verdict === "Runtime error" ||
                      submission.verdict === "Time limit exceeded"
                        ? `${submission.verdict} on test ${submission.results.length}`
                        : submission.verdict}
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
