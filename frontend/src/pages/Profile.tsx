// Profile.tsx
import { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import getURL from "../../utils/getURL";
import getToken from "../../utils/getToken.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";
import NavBar from "../components/NavBar";

// Import the CSS file
import "./Profile.css"; // Adjust the path if needed

interface Submission {
  title: string;
  difficulty: string;
  language: string;
  date: string; // Optional timestamp
}
// Profile component
export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  
  // State variables for profile data and recent submissions
  const [fullname, setFullname] = useState("");
  const [profilePic, setProfilePic] = useState(""); // Assuming profile picture is part of the response
  const [easySolved, setEasySolved] = useState(0);
  const [mediumSolved, setMediumSolved] = useState(0);
  const [hardSolved, setHardSolved] = useState(0);
  const [totalSolved, setTotalSolved] = useState(0);
  const recentSubmissions:Submission[] = ([
    {
      title: "Binary Tree Traversal",
      difficulty: "Medium",
      language: "Python",
      date: "2h ago",
    },
    {
      title: "Dynamic Array Implementation",
      difficulty: "Easy",
      language: "Java",
      date: "5h ago",
    },
    {
      title: "Graph Shortest Path",
      difficulty: "Medium",
      language: "C++",
      date: "1d ago",
    },
    {
      title: "String Manipulation",
      difficulty: "Hard",
      language: "JavaScript",
      date: "1d ago",
    },
    {
      title: "Longest Palindromic String",
      difficulty: "Easy",
      language: "Python",
      date: "2d ago",
    },
    {
      title: "Zigzag Conversion",
      difficulty: "Medium",
      language: "C++",
      date: "3d ago",
    },
    {
      title: "Merge K Sorted List",
      difficulty: "Hard",
      language: "C++",
      date: "3d ago",
    },
    {
      title: "Valid Sudoku",
      difficulty: "Easy",
      language: "C++",
      date: "3d ago",
    },
    {
      title: "First Missing",
      difficulty: "Easy",
      language: "Java",
      date: "5d ago",
    },
    {
      title: "Wildcard Matching",
      difficulty: "Hard",
      language: "Python",
      date: "7d ago",
    },
    {
      title: "Group Anagrams",
      difficulty: "Medium",
      language: "Python",
      date: "7d ago",
    },
    {
      title: "Trapping Rain Water",
      difficulty: "Hard",
      language: "C++",
      date: "10d ago",
    },
    {
      title: "Search Insert Position",
      difficulty: "Easy",
      language: "C++",
      date: "10d ago",
    },
  ]);
  
  // Function to fetch profile data
  const getProfile = async () => {
    try {
      const { data } = await axios.get(getURL(`/api/user/${username}`));
      const userData = data.data.user;
      setFullname(userData.fullname);
      setProfilePic("https://via.placeholder.com/150"); // Assuming profilePic is available
      setEasySolved(userData.easySolved);
      setMediumSolved(userData.mediumSolved);
      setHardSolved(userData.hardSolved);
      setTotalSolved(userData.totalSolved); // Assuming recent submissions are part of the response
    } catch (error) {
      console.log("Failed to fetch profile:", error);
    }
  };

  const [usernameFromToken, SetUsernameFromToken] = useState("");
  const token = getToken();
  let ID = null;
  if (token) {
    try {
      const decoded = jwtDecode(token) as JwtPayload & { userId: number };  // Cast the type

      // Log all the decoded data to the console
      ID = decoded.userId;
    } catch (error) {
      console.log("Error decoding token:", error);
    }
  }

  const getUser = async () => {
    try {
      const response = await axios.get(getURL("/api/user"), {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });
      console.log("res get profile", response);
      SetUsernameFromToken(response.data.data.user.username);
    } catch (error: any) {
      console.error(error);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getProfile();
  }, []);


  // Only show the "Edit Profile" button if the usernames match
  const shouldShowEditButton = usernameFromToken == username;

  return (
    <div>
      <NavBar />
      <div className="container mt-4">
        {/* Left Side - Profile Box */}
        <div className="row">
          <div className="col-md-4">
            <div className="profile-box">
              {/* Profile Picture */}
              <div className="profile-pic">
                <img src={profilePic} alt="Profile" className="profile-img" />
              </div>
              <div className="profile-info">
                <h3 className="profile-name">{fullname}</h3>
                <p className="profile-username">@{username}</p>
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
                    {easySolved} <span className="checkmark">&#10004;</span>
                  </p>
                </div>
                <div className="stat-item medium">
                  <h4>Medium</h4>
                  <p>
                    {mediumSolved} <span className="circle">&#8226;</span>
                  </p>
                </div>
                <div className="stat-item hard">
                  <h4>Hard</h4>
                  <p>
                    {hardSolved} <span className="cross">&#10060;</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Recent AC Submissions */}
          <div className="col-md-8">
            <div className="recent-ac-box">
              <h4>Recent AC Submissions</h4>
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Difficulty</th>
                    <th>Language</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSubmissions.map((submission, index) => (
                    <tr key={index}>
                      <td>{submission.title}</td>
                      <td
                        style={{
                          color: getDifficultyColor(submission.difficulty),
                        }}
                      >
                        {submission.difficulty}
                      </td>
                      <td
                        style={{ color: getLanguageColor(submission.language) }}
                      >
                        {submission.language}
                      </td>
                      <td>{submission.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <a href="#" className="view-all-link">
                View All Submissions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions to assign colors based on difficulty and language
function getDifficultyColor(difficulty: string) {
  if (difficulty === "Easy") return "green";
  if (difficulty === "Medium") return "orange";
  if (difficulty === "Hard") return "red";
  return "gray";
}

function getLanguageColor(language: string) {
  if (language === "Python") return "darkblue";
  if (language === "Java") return "green";
  if (language === "C++") return "darkgray";
  return "gray";
}
