import React from "react";
import { Card, ListGroup, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Temporary hardcoded user profile data
const userProfile = {
  username: "Dyu_coding",
  fullname: "Dyu Coding",
  avatar: "https://via.placeholder.com/150", // Placeholder avatar image URL
  rank: 1445747,
  badges: 0,
  languages: [
    { name: "C++", solved: 61 },
    { name: "C", solved: 1 },
  ],
  skills: [
    { level: "Advanced", skill: "Backtracking", count: 13 },
    { level: "Advanced", skill: "Dynamic Programming", count: 9 },
    { level: "Advanced", skill: "Divide and Conquer", count: 4 },
    { level: "Advanced", skill: "Quickselect", count: 1 },
    { level: "Advanced", skill: "Trie", count: 1 },
    { level: "Advanced", skill: "Union Find", count: 1 },
    { level: "Intermediate", skill: "Math", count: 15 },
    { level: "Intermediate", skill: "Hash Table", count: 12 },
    { level: "Intermediate", skill: "Recursion", count: 10 },
    { level: "Intermediate", skill: "Bit Manipulation", count: 6 },
    { level: "Intermediate", skill: "Greedy", count: 5 },
    { level: "Intermediate", skill: "Binary Search", count: 4 },
    { level: "Intermediate", skill: "Sliding Window", count: 1 },
    { level: "Fundamental", skill: "Array", count: 32 },
    { level: "Fundamental", skill: "String", count: 17 },
    { level: "Fundamental", skill: "Sorting", count: 10 },
    { level: "Fundamental", skill: "Two Pointers", count: 10 },
    { level: "Fundamental", skill: "Linked List", count: 7 },
    { level: "Fundamental", skill: "Matrix", count: 4 },
    { level: "Fundamental", skill: "Stack", count: 2 },
    { level: "Fundamental", skill: "Simulation", count: 1 },
  ],
  problemsSolved: {
    total: 62,
    easy: 16,
    medium: 36,
    hard: 10,
    totalProblems: 3343,
    attempting: 3,
  },
  recentAC: [
    { name: "Divide Two Integers", date: "17 days ago" },
    { name: "Maximum Swap", date: "17 days ago" },
    { name: "24 Game", date: "17 days ago" },
    { name: "Reducing Dishes", date: "20 days ago" },
    { name: "Unique Paths III", date: "a month ago" },
    { name: "Pow(x, n)", date: "a month ago" },
    { name: "Integer to English Words", date: "a month ago" },
    { name: "N-Queens", date: "a month ago" },
    { name: "Smallest Value of the Rearranged Number", date: "a month ago" },
    { name: "Largest Number", date: "a month ago" },
    { name: "3Sum", date: "a month ago" },
    { name: "Container With Most Water", date: "a month ago" },
    { name: "Two Sum II - Input Array Is Sorted", date: "a month ago" },
  ],
};

const ShowProfile: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAllSubmissions = () => {
    navigate("/submissions"); // Navigate to the submissions page (change route as per your project)
  };

  const percentageSolved =
    (userProfile.problemsSolved.total /
      userProfile.problemsSolved.totalProblems) *
    100;

  return (
    <>
      <div className="container mt-5 d-flex gap-4">
        {/* Left Section - Avatar and Stats */}
        <div className="col-md-4">
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-body-tertiary border-bottom">
              <div className="d-flex align-items-center gap-3">
                <img
                  src={userProfile.avatar}
                  alt="Avatar"
                  width="100"
                  height="100"
                  className="rounded-circle"
                />
                <div>
                  <h4>{userProfile.fullname}</h4>
                  <p className="text-muted">@{userProfile.username}</p>
                  <p>Rank: {userProfile.rank.toLocaleString()}</p>
                </div>
              </div>
            </Card.Header>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5 className="mb-3">Languages</h5>
                  <div>
                    {userProfile.languages.map((lang, index) => (
                      <div
                        key={index}
                        className="d-flex justify-content-between align-items-center mb-2"
                      >
                        <span
                          className="badge bg-light text-dark p-2 me-3"
                          style={{
                            borderRadius: "15px",
                            fontWeight: "500",
                            fontSize: "0.9rem",
                          }}
                        >
                          {lang.name}
                        </span>
                        <span className="text-end">
                          <strong>{lang.solved}</strong>{" "}
                          {lang.solved > 1
                            ? "problems solved"
                            : "problem solved"}
                        </span>
                      </div>
                    ))}
                  </div>
                </ListGroup.Item>

                <ListGroup.Item>
                  <h5 className="mb-3">Skills</h5>
                  <div>
                    {/* Advanced Skills */}
                    <div className="mb-4">
                      <h6 className="d-flex align-items-center">
                        <span
                          className="dot me-2"
                          style={{
                            backgroundColor: "red",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            display: "inline-block",
                          }}
                        ></span>
                        Advanced
                      </h6>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {userProfile.skills
                          .filter((skill) => skill.level === "Advanced")
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="badge bg-light text-dark p-2"
                              style={{ borderRadius: "10px" }}
                            >
                              {skill.skill}{" "}
                              <small className="text-muted">
                                x{skill.count}
                              </small>
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Intermediate Skills */}
                    <div className="mb-4">
                      <h6 className="d-flex align-items-center">
                        <span
                          className="dot me-2"
                          style={{
                            backgroundColor: "orange",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            display: "inline-block",
                          }}
                        ></span>
                        Intermediate
                      </h6>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {userProfile.skills
                          .filter((skill) => skill.level === "Intermediate")
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="badge bg-light text-dark p-2"
                              style={{ borderRadius: "10px" }}
                            >
                              {skill.skill}{" "}
                              <small className="text-muted">
                                x{skill.count}
                              </small>
                            </span>
                          ))}
                      </div>
                    </div>

                    {/* Fundamental Skills */}
                    <div className="mb-4">
                      <h6 className="d-flex align-items-center">
                        <span
                          className="dot me-2"
                          style={{
                            backgroundColor: "green",
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            display: "inline-block",
                          }}
                        ></span>
                        Fundamental
                      </h6>
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {userProfile.skills
                          .filter((skill) => skill.level === "Fundamental")
                          .map((skill, index) => (
                            <span
                              key={index}
                              className="badge bg-light text-dark p-2"
                              style={{ borderRadius: "10px" }}
                            >
                              {skill.skill}{" "}
                              <small className="text-muted">
                                x{skill.count}
                              </small>
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </div>

        {/* Right Section - Problems Solved and Recent AC */}
        <div className="col-md-8">
          <Card className="mb-4 shadow-sm">
            <Card.Body className="d-flex">
              {/* Left Section - Circular Progress Bar */}
              <div className="d-flex flex-column align-items-center me-5">
                {" "}
                {/* Removed column width and added a right margin */}
                <div style={{ width: 180, height: 180 }}>
                  {" "}
                  {/* Slightly increase size here */}
                  <CircularProgressbar
                    value={percentageSolved}
                    text={`${userProfile.problemsSolved.total}/${userProfile.problemsSolved.totalProblems}`}
                    styles={buildStyles({
                      textColor: "#000",
                      pathColor: "#f39c12",
                      trailColor: "#f0f0f0",
                      textSize: "20px", // Increase the size of the text inside the circle
                      pathTransitionDuration: 0.5,
                    })}
                  />
                </div>
                <div className="text-center mt-3">
                  <p style={{ fontSize: "22px", fontWeight: "bold" }}>
                    {userProfile.problemsSolved.total} Solved
                  </p>
                  <p className="text-muted" style={{ fontSize: "16px" }}>
                    {userProfile.problemsSolved.attempting} Attempting
                  </p>
                </div>
              </div>

              {/* Right Section - Difficulty Breakdown */}
              <div className="d-flex flex-column justify-content-center">
                <div className="d-flex flex-column gap-4 ms-4">
                  {" "}
                  {/* Add left margin to slightly push it closer to the circle */}
                  <div className="d-flex align-items-center">
                    <span
                      className="text-primary me-2"
                      style={{ fontSize: "22px" }}
                    >
                      Easy
                    </span>
                    <span style={{ fontSize: "22px" }}>
                      {userProfile.problemsSolved.easy}/832
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span
                      className="text-warning me-2"
                      style={{ fontSize: "22px" }}
                    >
                      Med.
                    </span>
                    <span style={{ fontSize: "22px" }}>
                      {userProfile.problemsSolved.medium}/1750
                    </span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span
                      className="text-danger me-2"
                      style={{ fontSize: "22px" }}
                    >
                      Hard
                    </span>
                    <span style={{ fontSize: "22px" }}>
                      {userProfile.problemsSolved.hard}/761
                    </span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Recent Accepted Problems</h5>
              <ListGroup variant="flush">
                {userProfile.recentAC.map((problem, index) => (
                  <ListGroup.Item
                    key={index}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff",
                    }}
                  >
                    {problem.name}{" "}
                    <span className="text-muted">- {problem.date}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="primary" onClick={handleViewAllSubmissions}>
                  View All Submissions
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default ShowProfile;
