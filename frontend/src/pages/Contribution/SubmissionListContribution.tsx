import { useNavigate, useParams } from "react-router-dom";
import { Table } from "react-bootstrap";
import { SubmissionWithResults } from "../../interfaces/interface.ts";
import Loader from "../../components/Loader.tsx";
import ContributionNav from "../../components/ContributionNav.tsx";
import { language_BE_to_FE_map, verdictMap } from "../../utils/constanst.ts";
import { longReadableTimeConverter } from "../../utils/general.ts";
import useFetch from "../../hooks/useFetch.ts";

export default function SubmissionListContribution() {
  const { problemId } = useParams();

  const navigate = useNavigate();

  const { data, loading } = useFetch<{ submissions: SubmissionWithResults[] }>(
    `/api/contributions/${problemId}/submissions`,
    {
      includeToken: true,
    },
  );
  const fetchSubmissions = data?.data.submissions;

  if (loading || !fetchSubmissions) {
    return <Loader />;
  }

  const submissions = fetchSubmissions.map((fetchSubmission) => {
    const maxTime = Math.max(
      0,
      ...fetchSubmission.results.map((result) => result.time),
    );
    return {
      ...fetchSubmission,
      language: language_BE_to_FE_map[fetchSubmission.language],
      verdict: verdictMap[fetchSubmission.verdict],
      createdAt: longReadableTimeConverter(fetchSubmission.createdAt),
      maxTime: maxTime,
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
                <th className="text-center" style={{ width: "25%" }}>
                  Verdict
                </th>
                <th className="text-center" style={{ width: "15%" }}>
                  Runtime
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
                  <td className="text-center">{`${submission.maxTime} ms`}</td>
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
