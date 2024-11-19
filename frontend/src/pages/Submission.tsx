// import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Table } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// import { useEffect } from "react";

interface Tag {
  label: string;
  selected: boolean;
}

export default function Contributions() {
  const navigate = useNavigate();
  const initialTags: Tag[] = [
    { label: "Array", selected: false },
    { label: "String", selected: false },
    { label: "Hash Table", selected: false },
    { label: "Dynamic Programming", selected: false },
    { label: "Math", selected: false },
    { label: "Sorting", selected: false },
    { label: "Greedy", selected: false },
    { label: "Depth-First Search", selected: false },
    { label: "Database", selected: false },
    { label: "Binary Search", selected: false },
    { label: "Matrix", selected: false },
    { label: "Tree", selected: false },
    { label: "Breadth-First Search", selected: false },
  ];

  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [search, setSearch] = useState("");

  const toggleTag = (index: number) => {
    setTags((prevTags) =>
      prevTags.map((tag, i) =>
        i === index ? { ...tag, selected: !tag.selected } : tag,
      ),
    );
  };

  const handleResetTags = () => {
    setTags(initialTags);
  };

  const pickRandom = () => {
    const randomProblem = Problems[Math.floor(Math.random() * Problems.length)];
    navigate(`/contributions/${randomProblem.id}/description`);
  };

  const Problems = [
    {
      id: 1,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "2684. Maximum Number of Moves in a Grid",
    },
    {
      id: 2,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "1. Two Sum",
    },
    {
      id: 3,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Wrong Answer",
      runtime: "0 ms",
      language: "cpp",
      title: "2. Add Two Numbers",
    },
    {
      id: 4,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "3. Longest Substring Without Repeating Characters",
    },
    {
      id: 5,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Time Limit Exceeded",
      runtime: "0 ms",
      language: "cpp",
      title: "4. Median of Two Sorted Arrays",
    },
    {
      id: 6,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "5. Longest Palindromic Substring",
    },
    {
      id: 7,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "6. Zigzag Conversion",
    },
    {
      id: 8,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "7. Reverse Integer",
    },
    {
      id: 9,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Wrong Answer",
      runtime: "0 ms",
      language: "cpp",
      title: "8. String to Integer (atoi)",
    },
    {
      id: 10,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "9. Palindrome Number",
    },
    {
      id: 11,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Time Limit Exceeded",
      runtime: "0 ms",
      language: "cpp",
      title: "10. Regular Expression Matching",
    },
    {
      id: 12,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "11. Container With Most Water",
    },
    {
      id: 13,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "12. Integer to Roman",
    },
    {
      id: 14,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "13. Roman to Integer",
    },
    {
      id: 15,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Wrong Answer",
      runtime: "0 ms",
      language: "cpp",
      title: "14. Longest Common Prefix",
    },
    {
      id: 16,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Time Limit Exceeded",
      runtime: "0 ms",
      language: "cpp",
      title: "15. 3Sum",
    },
    {
      id: 17,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Wrong Answer",
      runtime: "0 ms",
      language: "cpp",
      title: "16. 3Sum Closest",
    },
    {
      id: 18,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Accepted",
      runtime: "0 ms",
      language: "cpp",
      title: "17. Letter Combinations of a Phone Number",
    },
    {
      id: 19,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Wrong Answer",
      runtime: "0 ms",
      language: "cpp",
      title: "18. 4Sum",
    },
    {
      id: 20,
      timeSubmitted: "5 days, 20 hours ago",
      status: "Time Limit Exceeded",
      runtime: "0 ms",
      language: "cpp",
      title: "19. Remove Nth Node From End of List",
    },
  ];

  function getStatusColor(status: string) {
    switch (status) {
      case "Accepted":
        return "green";
      case "Wrong Answer":
        return "red";
      case "Time Limit Exceeded":
        return "orange";
      default:
        return "gray";
    }
  }

  return (
    <>
      <div className="d-flex flex-column">
        <NavBar />
        <div className="container d-flex flex-column">
          <div className="d-flex flex-row mt-3 align-items-center gap-2"></div>
          <h4>All My Submissions</h4>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                {/* <div className="d-flex"> */}
                <th>Time Submitted</th>
                <th>Question</th>
                <th>Status</th>
                <th>Runtime</th>
                <th>Language</th>
              </tr>
            </thead>
            <tbody>
              {Problems.map((problem) => (
                <tr key={problem.id}>
                  <td>{problem.timeSubmitted}</td>
                  <td>
                    <Link
                      to={`/contributions/${problem.id}/description`}
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
                      {problem.title}
                    </Link>
                  </td>
                  <td style={{ color: getStatusColor(problem.status) }}>
                    <strong>{problem.status}</strong>
                  </td>
                  <td>{problem.runtime}</td>
                  <td>{problem.language}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <Footer />
      </div>
    </>
  );
}
