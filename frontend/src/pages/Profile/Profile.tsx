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
            <div className="col-md-4 p-3 border rounded-4 shadow">
              <div className="profile-box">
                {/* Profile Picture */}
                <div className="profile-pic">
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="profile-img rounded-circle"
                  />
                </div>
                <div className="profile-info">
                  <h3 className="profile-name">{user.fullname}</h3>
                  <p className="profile-username">{user.username}</p>
                </div>

                {shouldShowEditButton && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      marginBottom: "10px",
                    }}
                  >
                    <Button
                      variant="primary"
                      onClick={() => navigate("/profile")}
                      style={{
                        backgroundColor: "#e4dff0",
                        color: "#0b665e",
                        width: "100%",
                        fontSize: "20px",
                        padding: "5px 20px",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      Edit Profile
                    </Button>
                  </div>
                )}

                {/* Problem Solving Stats */}
                <div className="stats-box">
                  <div className="stat-item">
                    <h4>Total Solved</h4>
                    <p>{totalSolved}</p>
                  </div>
                  <div className="stat-item easy">
                    <h4>Easy</h4>
                    <p>
                      {bronzeSolved} <span className="checkmark">&#10004;</span>
                    </p>
                  </div>
                  <div className="stat-item medium">
                    <h4>Medium</h4>
                    <p>
                      {platinumSolved} <span className="circle">&#8226;</span>
                    </p>
                  </div>
                  <div className="stat-item hard">
                    <h4>Hard</h4>
                    <p>
                      {masterSolved} <span className="cross">&#10060;</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Recent AC Submissions */}
            <div className="col-md-8 p-3 border rounded-4 shadow">
              <div className="recent-ac-box">
                <div className="d-flex justify-content-between">
                  <h4>Recent AC Submissions</h4>
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
