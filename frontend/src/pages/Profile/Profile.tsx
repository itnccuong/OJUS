import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance.ts";
import {
  SubmissionWithProblem,
  UserWithAvatarInterface,
} from "../../interfaces/interface.ts";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.tsx";
import getToken from "../../utils/getToken.ts";
import { Button, Form, Modal, Table } from "react-bootstrap";
import {
  difficultyMapping,
  language_BE_to_FE_map,
} from "../../utils/constanst.ts";
import { shortReadableTimeConverter } from "../../utils/general.ts";
import useFetch from "../../hooks/useFetch.ts";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [show, setShow] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const { data: fetchUser, loading: userLoading } = useFetch<{
    user: UserWithAvatarInterface;
  }>(`/api/user/by-name/${username}`);
  const user = fetchUser?.data.user;

  const { data: userFromToken, loading: userFromTokenLoading } = useFetch<{
    user: UserWithAvatarInterface;
  }>("/api/user", {
    includeToken: true,
  });
  const usernameFromToken = userFromToken?.data.user.username;

  const { data: fetchSubmissionData, loading: fetchSubmissionLoading } =
    useFetch<{
      submissions: SubmissionWithProblem[];
    }>(`/api/user/${user?.userId}/submissions/AC`, {
      includeToken: true,
      skip: !user,
    });
  const fetchSubmissions = fetchSubmissionData?.data.submissions;

  if (
    userLoading ||
    userFromTokenLoading ||
    fetchSubmissionLoading ||
    !user ||
    !fetchSubmissions ||
    !userFromToken
  ) {
    return <Loader />;
  }

  const uniqueProblems = new Set();
  const bronzeProblems = new Set();
  const platinumProblems = new Set();
  const masterProblems = new Set();

  fetchSubmissions.forEach((submission) => {
    const problemId = submission.problem.problemId; // Assuming each problem has a unique ID
    uniqueProblems.add(problemId);

    if (submission.problem.difficulty === 1) {
      bronzeProblems.add(problemId);
    } else if (submission.problem.difficulty === 2) {
      platinumProblems.add(problemId);
    } else if (submission.problem.difficulty === 3) {
      masterProblems.add(problemId);
    }
  });

  const totalSolved = uniqueProblems.size;
  const bronzeSolved = bronzeProblems.size;
  const platinumSolved = platinumProblems.size;
  const masterSolved = masterProblems.size;

  const recentACSubmissions = fetchSubmissions.map((fetchSubmission) => {
    return {
      ...fetchSubmission,
      problem: {
        ...fetchSubmission.problem,
        difficulty: difficultyMapping[fetchSubmission.problem.difficulty],
      },
      language: language_BE_to_FE_map[fetchSubmission.language],
      createdAt: shortReadableTimeConverter(fetchSubmission.createdAt),
    };
  });

  // Only show the "Edit Profile" button if the usernames match
  const isUserMatchAccount = usernameFromToken == username;

  const hanldeUpdateAvatar = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    } else {
      console.log("No file");
      return;
    }
    try {
      const response = await toast.promise(
        axiosInstance.patch("/api/user/avatar", formData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }),
        {
          pending: "Updating...",
          success: "Update avatar successfully",
        },
      );
      console.log("Update avatar", response);
      setShow(false);
      setFile(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  const handleDeleteAvatar = async () => {
    try {
      const response = await toast.promise(
        axiosInstance.delete("/api/user/avatar", {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }),
        {
          pending: "Updating...",
          success: "Update avatar successfully",
        },
      );
      console.log("Update avatar", response);
      setShow(false);
      setFile(null);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
      console.error(error);
    } finally {
      setShow(false);
    }
  };

  return (
    <div className="flex-grow-1 py-4 px-5 bg-body-tertiary">
      {/* Left Side - Profile Box */}
      <div className="container-xxl d-flex justify-content-center gap-3">
        <div className="col-4 border rounded-4 shadow p-4 bg-white">
          <div className="header d-flex align-items-center">
            {/* Profile Picture */}
            <div className="profile-pic">
              <img
                src={user.avatar ? user.avatar.url : "/user.png"}
                alt="Profile"
                className="profile-img rounded-circle"
                width={100}
                height={100}
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  isUserMatchAccount && setShow(true);
                }}
                style={{
                  cursor: "pointer",
                  objectFit: "cover", // Ensures the image covers the container
                }}
              />
            </div>
            {/* Fullname Section */}
            <div className="flex-grow-1 d-flex flex-column">
              <h4 className="text-center">{user.fullname}</h4>
              <div className="d-flex justify-content-center gap-3">
                {/*Add github link*/}
                <a
                  href={user.githubLink}
                  target="_blank" // Open in new tab
                  rel="noopener noreferrer" // Open in new tab
                >
                  <img src="/github-mark.svg" width="30" height="30" />
                </a>

                <a
                  href={user.facebookLink}
                  target="_blank" // Open in new tab
                  rel="noopener noreferrer" // Open in new tab
                >
                  <img src="/facebook.svg" width="32" height="32" />
                </a>
              </div>
            </div>
          </div>

          <div className="edit-button mt-4 border-bottom pb-3">
            <Button
              disabled={!isUserMatchAccount}
              variant={isUserMatchAccount ? "success" : "secondary"}
              onClick={() => navigate("/profile")}
              className="w-100 rounded-5"
            >
              Edit Profile
            </Button>
          </div>

          <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Avatar</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-dark">
              <div className="d-flex flex-column justify-content-center align-items-center p-3">
                <div className="profile-pic border rounded-circle p-1 bg-white">
                  <img
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : user.avatar
                          ? user.avatar.url
                          : "/user.png"
                    }
                    alt="Profile"
                    className="profile-img rounded-circle"
                    width={150}
                    height={150}
                    style={{
                      objectFit: "cover", // Ensures the image covers the container
                    }}
                  />
                </div>
                <Form.Group>
                  <div className="custom-file">
                    <Form.Control
                      style={{
                        display: "none",
                      }}
                      required
                      id="customFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setFile(
                          (e.target as HTMLInputElement).files?.[0] || null,
                        )
                      }
                    />
                    <Form.Label
                      htmlFor="customFile"
                      className="custom-file-label btn btn-light mt-3"
                    >
                      Choose image
                    </Form.Label>
                  </div>
                </Form.Group>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button
                disabled={!user.avatar}
                variant="danger"
                onClick={() => handleDeleteAvatar()}
              >
                Delete avatar
              </Button>
              <Button
                disabled={!file}
                variant="primary"
                onClick={() => hanldeUpdateAvatar()}
              >
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>

          <div className="stat-header mt-3">
            <h4>Problem Stats</h4>
          </div>
          <div className="stat-body">
            <div className="d-flex justify-content-between align-items-center bg-body-secondary p-3 rounded-4 mt-3">
              <img
                className="rounded-circle"
                src="/challenger.png"
                width="40"
                height="40"
              />
              <h5 className="text-warning fw-bold">Total solved </h5>
              <h4>{totalSolved}</h4>
            </div>

            <div className="d-flex justify-content-between align-items-center bg-body-secondary p-3 rounded-4 mt-3">
              <img
                className="rounded-circle"
                src="/bronze.png"
                width="40"
                height="40"
              />
              <h5 className="text-warning-emphasis fw-bold">Bronze </h5>
              <h4>{bronzeSolved}</h4>
            </div>

            <div className="d-flex justify-content-between align-items-center bg-body-secondary p-3 rounded-4 mt-3">
              <img
                className="rounded-circle"
                src="/platinum.png"
                width="40"
                height="40"
              />
              <h5 className="text-primary fw-bold">Platinum </h5>
              <h4>{platinumSolved}</h4>
            </div>

            <div className="d-flex justify-content-between align-items-center bg-body-secondary p-3 rounded-4 mt-3">
              <img
                className="rounded-circle"
                src="/master.png"
                width="40"
                height="40"
              />
              <h5 className="text-danger fw-bold">Master </h5>
              <h4>{masterSolved}</h4>
            </div>
          </div>
        </div>
        {/*Right Side - Recent AC Submissions*/}
        <div className="col-8 border rounded-4 shadow p-4 bg-white">
          <div className="d-flex justify-content-between">
            <h4>Recent AC</h4>
            {isUserMatchAccount && (
              <Button onClick={() => navigate(`/submissions`)}>
                View all submissions
              </Button>
            )}
          </div>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                {/* <div className="d-flex"> */}
                <th
                  className="text-center"
                  style={{
                    width: "35%",
                  }}
                >
                  Title
                </th>
                <th className="text-center" style={{ width: "20%" }}>
                  Language
                </th>
                {/* </div> */}
                <th className="text-center" style={{ width: "20%" }}>
                  Difficulty
                </th>
                <th className="text-center">Submit time</th>
              </tr>
            </thead>
            <tbody>
              {recentACSubmissions.map((submission) => (
                <tr
                  key={submission.submissionId}
                  onClick={() =>
                    navigate(`/submissions/${submission.submissionId}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-center">{submission.problem.title}</td>

                  {/*Language*/}
                  <td className="text-center">{submission.language}</td>
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
