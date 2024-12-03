import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Button, Dropdown, DropdownButton, Form, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  GetAllProblemsInterface,
  ProblemInterface,
} from "../../interfaces/response.interface.ts";
import getToken from "../../utils/getToken.ts";
import axiosInstance from "../../utils/getURL.ts";

interface Tag {
  label: string;
  selected: boolean;
}

export default function ProblemList() {
  const token = getToken();
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

  // const pickRandom = () => {
  //   const randomProblem = problems[Math.floor(Math.random() * problems.length)];
  //   navigate(`/problems/${randomProblem.id}/description`);
  // };

  const [fetchProblems, setFetchProblems] = useState<ProblemInterface[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        let response;
        if (!token) {
          response = await axiosInstance.get<GetAllProblemsInterface>(
            "/api/problems/no-account",
          );
        } else {
          response = await axiosInstance.get<GetAllProblemsInterface>(
            "/api/problems/with-account",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
        }
        setFetchProblems(response.data.data.problems);
        console.log("Problems", response.data);
        console.log(response.data.data.problems[0].status.toString());
      } catch (error) {
        console.error(error);
      }
    };
    fetchProblems();
  }, []);

  const problems = fetchProblems.map((fetchProblem) => {
    const difficultyMapping: Record<number, string> = {
      1: "Easy",
      2: "Medium",
      3: "Hard",
    };

    const statusMapping: Record<string, string> = {
      false: "Todo",
      true: "Solved",
    };

    return {
      ...fetchProblem,
      userStatus:
        statusMapping[fetchProblem.userStatus.toString()] || "Unknown",
      difficulty: difficultyMapping[fetchProblem.difficulty] || "Unknown",
      tags: splitString(fetchProblem.tags),
    };
  });
  function splitString(inputString: string) {
    return inputString.split(",");
  }

  // const Problems = [
  //   {
  //     id: 1,
  //     title: "2684. Maximum Number of Moves in a Grid",
  //     difficulty: "Medium",
  //     tags: ["Array", "Dynamic Programming"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 2,
  //     title: "1. Two Sum",
  //     difficulty: "Easy",
  //     tags: ["Array", "Hash Table"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 3,
  //     title: "2. Add Two Numbers",
  //     difficulty: "Medium",
  //     tags: ["Linked List", "Math"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 4,
  //     title: "3. Longest Substring Without Repeating Characters",
  //     difficulty: "Medium",
  //     tags: ["String", "Sliding Window"],
  //     status: "",
  //   },
  //   {
  //     id: 5,
  //     title: "4. Median of Two Sorted Arrays",
  //     difficulty: "Hard",
  //     tags: ["Array", "Binary Search"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 6,
  //     title: "5. Longest Palindromic Substring",
  //     difficulty: "Medium",
  //     tags: ["String", "Dynamic Programming"],
  //     status: "",
  //   },
  //   {
  //     id: 7,
  //     title: "6. Zigzag Conversion",
  //     difficulty: "Medium",
  //     tags: ["String"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 8,
  //     title: "7. Reverse Integer",
  //     difficulty: "Medium",
  //     tags: ["Math"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 9,
  //     title: "8. String to Integer (atoi)",
  //     difficulty: "Medium",
  //     tags: ["String", "Math"],
  //     status: "",
  //   },
  //   {
  //     id: 10,
  //     title: "9. Palindrome Number",
  //     difficulty: "Easy",
  //     tags: ["Math"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 11,
  //     title: "10. Regular Expression Matching",
  //     difficulty: "Hard",
  //     tags: ["String", "Dynamic Programming"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 12,
  //     title: "11. Container With Most Water",
  //     difficulty: "Medium",
  //     tags: ["Array", "Two Pointers"],
  //     status: "",
  //   },
  //   {
  //     id: 13,
  //     title: "12. Integer to Roman",
  //     difficulty: "Medium",
  //     tags: ["Math", "String"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 14,
  //     title: "13. Roman to Integer",
  //     difficulty: "Easy",
  //     tags: ["Math", "String"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 15,
  //     title: "14. Longest Common Prefix",
  //     difficulty: "Easy",
  //     tags: ["String"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 16,
  //     title: "15. 3Sum",
  //     difficulty: "Medium",
  //     tags: ["Array", "Two Pointers", "Sorting"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 17,
  //     title: "16. 3Sum Closest",
  //     difficulty: "Medium",
  //     tags: ["Array", "Two Pointers"],
  //     status: "",
  //   },
  //   {
  //     id: 18,
  //     title: "17. Letter Combinations of a Phone Number",
  //     difficulty: "Medium",
  //     tags: ["String", "Backtracking"],
  //     status: "",
  //   },
  //   {
  //     id: 19,
  //     title: "18. 4Sum",
  //     difficulty: "Medium",
  //     tags: ["Array", "Two Pointers", "Sorting"],
  //     status: "Solved",
  //   },
  //   {
  //     id: 20,
  //     title: "19. Remove Nth Node From End of List",
  //     difficulty: "Medium",
  //     tags: ["Linked List", "Two Pointers"],
  //     status: "Solved",
  //   },
  // ];

  const Difficulty = ["Easy", "Medium", "Hard"];

  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");

  const getSelectedTags = () =>
    tags.filter((tag) => tag.selected).map((tag) => tag.label);

  const filteredProblems = problems.filter(
    (problem) =>
      (problem.difficulty === difficulty || difficulty === "All") &&
      (problem.userStatus === status || status === "All") &&
      getSelectedTags().every((tag) => problem.tags.includes(tag)) &&
      problem.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="d-flex flex-column">
        <NavBar />
        <div className="container d-flex flex-column">
          <div className="d-flex flex-row mt-3 align-items-center gap-2">
            <DropdownButton variant="secondary" title="Difficulty">
              <div className="d-flex flex-column">
                {Difficulty.map((diff, index) => (
                  <Dropdown.Item
                    key={index}
                    onClick={() => {
                      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                      difficulty === diff
                        ? setDifficulty("All")
                        : setDifficulty(diff);
                    }}
                  >
                    <Button
                      variant="white"
                      className={`text-${
                        diff === "Easy"
                          ? "success"
                          : diff === "Medium"
                            ? "warning"
                            : "danger"
                      }`}
                    >
                      {diff}
                    </Button>
                    <span className="ms-4">
                      {difficulty === diff ? (
                        <img
                          src="/done.svg"
                          width="30"
                          height="24"
                          alt="React Bootstrap logo"
                        />
                      ) : null}
                    </span>
                  </Dropdown.Item>
                ))}
              </div>
            </DropdownButton>

            <DropdownButton variant="secondary" title="Status">
              <div className="d-flex flex-column">
                <Dropdown.Item
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    status === "Solved"
                      ? setStatus("All")
                      : setStatus("Solved");
                  }}
                >
                  <Button variant="white" className="text-success">
                    <div className="d-flex gap-2">
                      <img src="/done2.svg" width="24" height="24" />
                      Solved
                    </div>
                  </Button>
                  <span className="ms-4">
                    {status === "Solved" ? (
                      <img
                        src="/done.svg"
                        width="30"
                        height="24"
                        alt="React Bootstrap logo"
                      />
                    ) : null}
                  </span>
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    status === "Todo" ? setStatus("All") : setStatus("Todo");
                  }}
                >
                  <Button variant="white" className="text-warning">
                    <div className="d-flex gap-2">
                      <img src="/attempted.svg" width="24" height="24" />
                      To do
                    </div>
                  </Button>
                  <span className="ms-4">
                    {status === "Todo" ? (
                      <img
                        src="/done.svg"
                        width="30"
                        height="24"
                        alt="React Bootstrap logo"
                      />
                    ) : null}
                  </span>
                </Dropdown.Item>
              </div>
            </DropdownButton>

            <DropdownButton
              // key="2"
              variant="secondary"
              title="Tags"
            >
              <div
                className="mb-3"
                style={{
                  width: "300px",
                }}
              >
                {tags.map((tag, index) => (
                  <Button
                    variant={tag.selected ? "primary" : "light"}
                    key={index}
                    className={`badge rounded-pill m-1 ${
                      tag.selected ? "" : "text-dark"
                    } mx-1`}
                    onClick={() => toggleTag(index)}
                    style={{ cursor: "pointer" }}
                  >
                    {tag.label}
                  </Button>
                ))}
              </div>
              <div className="d-flex justify-content-end border-top">
                <Button
                  variant="primary"
                  className=" w-25 mt-3 me-2"
                  onClick={() => handleResetTags()}
                >
                  Reset
                </Button>
              </div>
            </DropdownButton>
            <Form>
              <Form.Control
                type=""
                placeholder="Search questions"
                className="mr-sm-2 bg-light"
                onChange={(e) => setSearch(e.target.value)}
              />
            </Form>
            <div
              className="d-flex ms-2"
              // onClick={() => pickRandom()}
              style={{
                cursor: "pointer",
              }}
            >
              <img
                src="/random.svg"
                width="30"
                height="24"
                alt="React Bootstrap logo"
              />
              <span className="ms-2">Pick Random</span>
            </div>
          </div>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                {/* <div className="d-flex"> */}
                <th
                  style={{
                    width: "6%",
                  }}
                >
                  Status
                </th>
                <th style={{ width: "40%" }}>
                  <div
                    className="d-flex justify-content-between cursor-pointer"
                    style={
                      {
                        // cursor: "pointer",
                      }
                    }
                    onClick={() => {
                      alert("implement sort");
                    }}
                  >
                    <span>Title</span>
                    <img
                      src="/sort.svg"
                      // width="30"
                      // height="24"
                      alt="React Bootstrap logo"
                    />
                  </div>
                </th>
                {/* </div> */}
                <th style={{ width: "40%" }}>Tags</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    <strong>No problems found</strong>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => (
                  <tr key={problem.problemId}>
                    <td>
                      {problem.userStatus === "Solved" ? (
                        <img src="/done2.svg" width="30" height="24" />
                      ) : (
                        <img src="/attempted.svg" width="30" height="24" />
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/problems/${problem.problemId}/description`}
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

                    <td>
                      {problem.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="badge rounded-pill m-1 bg-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </td>

                    <td>
                      <span
                        className={`badge ${
                          problem.difficulty === "Easy"
                            ? "text-success"
                            : problem.difficulty === "Medium"
                              ? "text-warning"
                              : "text-danger"
                        }`}
                      >
                        {problem.difficulty}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
        <Footer />
      </div>
    </>
  );
}
