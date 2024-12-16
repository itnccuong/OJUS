import { useState, useEffect } from "react";
import { Button, Table } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";

import axiosInstance from "../../../utils/getURL.ts";
import Footer from "../../components/Footer.tsx";
import {
  SubmissionWithProblem,
  UserInterface,
} from "../../../interfaces/model.interface.ts";
import {
  ResponseInterface,
  SubmissionListFromUserResponseInterface,
  UserResponseInterface,
} from "../../../interfaces/response.interface.ts";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.tsx";
import getToken from "../../../utils/getToken.ts";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();

  // State variables for profile data and recent submissions
  const [user, setUser] = useState<UserInterface>();
  const [profilePic, setProfilePic] = useState(""); // Assuming profile picture is part of the response

  const [usernameFromToken, SetUsernameFromToken] = useState("");

  // Function to fetch profile data

  const [fetchSubmissions, setFetchSubmissions] = useState<
    SubmissionWithProblem[]
  >([]);

  const [loading, setLoading] = useState(true);

  const getUserFromName = async () => {
    try {
      const { data } = await axiosInstance.get<
        ResponseInterface<UserResponseInterface>
      >(`/api/user/${username}`);
      console.log("Get user from name", data);
      setUser(data.data.user);
      setProfilePic("https://via.placeholder.com/150");
    } catch (error) {
      console.error(error);
    }
  };
  const getUserFromToken = async () => {
    try {
      const token = getToken();
      if (!token) {
        return;
      }
      const response = await axiosInstance.get("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });
      console.log("Get user from token", response);
      SetUsernameFromToken(response.data.data.user.username);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchData = async () => {
    try {
      if (!user) {
        return;
      }
      const res = await axiosInstance.get<
        ResponseInterface<SubmissionListFromUserResponseInterface>
      >(`/api/user/${user.userId}/submissions/AC`);

      console.log("Fetch AC submission", res.data);
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
  useEffect(() => {
    getUserFromName();
    getUserFromToken();
  }, []);

  useEffect(() => {
    fetchData();
  }, [user]);

  if (loading || !user) {
    return <Loader />;
  }

  const totalSolved = fetchSubmissions.length;
  const bronzeSolved = fetchSubmissions.filter(
    (submission) => submission.problem.difficulty === 1,
  ).length;
  const platinumSolved = fetchSubmissions.filter(
    (submission) => submission.problem.difficulty === 2,
  ).length;
  const masterSolved = fetchSubmissions.filter(
    (submission) => submission.problem.difficulty === 3,
  ).length;

  const recentACSubmissions = fetchSubmissions.map((fetchSubmission) => {
    const languageMap: Record<string, string> = {
      py: "Python",
      c: "C",
      cpp: "C++",
      java: "Java",
      js: "JavaScript",
    };

    const date = new Date(fetchSubmission.createdAt);

    const readableTime = date.toLocaleString("en-US", {
      year: "numeric", // e.g., "2024"
      month: "long", // e.g., "December"
      day: "numeric", // e.g., "6"
    });

    const difficultyMapping: Record<number, string> = {
      1: "Bronze",
      2: "Platinum",
      3: "Master",
    };

    return {
      ...fetchSubmission,
      problem: {
        ...fetchSubmission.problem,
        difficulty: difficultyMapping[fetchSubmission.problem.difficulty],
      },
      language: languageMap[fetchSubmission.language],
      createdAt: readableTime,
    };
  });

  // Only show the "Edit Profile" button if the usernames match
  const shouldShowEditButton = usernameFromToken == username;

  return (
    <div className="d-flex flex-column">
      <NavBar />
      <div className="p-3">
        <div className="container mt-3">
          {/* Left Side - Profile Box */}
          <div className="d-flex justify-content-between gap-4">
            <div
              className="col-md-4 p-3 border rounded-4 shadow"
              style={{
                minHeight: "83vh",
              }}
            >
              <div className="container pt-2 pb-2">
                {/* Profile Picture */}
                <div className="header d-flex align-items-center">
                  {/* Profile Picture */}
                  <div className="profile-pic">
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="profile-img rounded-circle"
                      width={100}
                      height={100}
                    />
                  </div>

                  {/* Fullname Section */}
                  <div className="flex-grow-1 d-flex justify-content-center">
                    <h4>{user.fullname}</h4>
                  </div>
                </div>

                <div className="edit-button mt-4 border-bottom pb-3">
                  <Button
                    disabled={!shouldShowEditButton}
                    variant={shouldShowEditButton ? "success" : "secondary"}
                    onClick={() => navigate("/profile")}
                    className="w-100"
                  >
                    Edit Profile
                  </Button>
                </div>

                <div className="stat-header mt-3">
                  <h4>Problem Stats</h4>
                </div>
                <div className="stat-body">
                  <div className="d-flex justify-content-between align-items-center bg-grey p-3 rounded-4 mt-3">
                    <img
                      className="rounded-circle"
                      src="/challenger.png"
                      width="48"
                      height="48"
                    />
                    <h5 className="text-warning fw-bold">Total solved </h5>
                    <h4>{totalSolved}</h4>
                  </div>

                  <div className="d-flex justify-content-between align-items-center bg-grey p-3 rounded-4 mt-3">
                    <img
                      className="rounded-circle"
                      src="/bronze.png"
                      width="48"
                      height="48"
                    />
                    <h5 className="text-warning-emphasis fw-bold">Bronze </h5>
                    <h4>{bronzeSolved}</h4>
                  </div>

                  <div className="d-flex justify-content-between align-items-center bg-grey p-3 rounded-4 mt-3">
                    <img
                      className="rounded-circle"
                      src="/platinum.png"
                      width="48"
                      height="48"
                    />
                    <h5 className="text-primary fw-bold">Platinum </h5>
                    <h4>{platinumSolved}</h4>
                  </div>

                  <div className="d-flex justify-content-between align-items-center bg-grey p-3 rounded-4 mt-3">
                    <img
                      className="rounded-circle"
                      src="/master.png"
                      width="48"
                      height="48"
                    />
                    <h5 className="text-danger fw-bold">Master </h5>
                    <h4>{masterSolved}</h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Recent AC Submissions */}
            <div className="col-md-8 p-3 border rounded-4 shadow">
              <div className="container pt-2">
                <div className="d-flex justify-content-between">
                  <h4>Recent AC</h4>
                  <Button>View all submissions</Button>
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
                            {submission.problem.title}
                          </Link>
                        </td>

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
        </div>
      </div>
      <Footer />
    </div>
  );
}
