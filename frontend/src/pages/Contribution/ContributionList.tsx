import { Button, Dropdown, DropdownButton, Form, Table } from "react-bootstrap";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getToken from "../../../utils/getToken.ts";

import { useEffect } from "react";

import {
  ResponseInterface,
  ContributionListResponseInterface,
} from "../../../interfaces/response.interface.ts";
import axiosInstance from "../../../utils/getURL.ts";
import { ProblemInterface } from "../../../interfaces/model.interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface Tag {
  label: string;
  selected: boolean;
}

export default function ContributionList() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("All");

  //Check if user is logged in
  const token = getToken();
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/accounts/login");
    }
  }, [token, navigate]);

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

  // const [Problems, setProblems] = useState([]); // Khởi tạo state cho Problems
  const [contributes, setContributes] = useState<ProblemInterface[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchContributes = async () => {
      try {
        const { data } = await axiosInstance.get<
          ResponseInterface<ContributionListResponseInterface>
        >("/api/contributions/", {
          headers: { Authorization: "Bearer " + token },
        });

        setContributes(data.data.contributions);
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

    fetchContributes();
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Chuyển đổi dữ liệu từ contribute thành problem
  const Problems = contributes.map((contribute) => {
    const difficultyMapping: Record<number, string> = {
      1: "Easy",
      2: "Medium",
      3: "Hard",
    };

    return {
      id: contribute.problemId,
      title: contribute.title,
      difficulty: difficultyMapping[contribute.difficulty] || "Unknown",
      tags: splitString(contribute.tags),
    };
  });

  function splitString(inputString: string) {
    return inputString.split(",");
  }

  const pickRandom = () => {
    const randomProblem = Problems[Math.floor(Math.random() * Problems.length)];
    navigate(`/contributions/${randomProblem.id}/description`);
  };

  const Difficulty = ["Easy", "Medium", "Hard"];

  const getSelectedTags = () =>
    tags.filter((tag) => tag.selected).map((tag) => tag.label);

  const filteredProblems = Problems.filter(
    (problem) =>
      (problem.difficulty === difficulty || difficulty === "All") &&
      getSelectedTags().every((tag) => problem.tags.includes(tag)) &&
      problem.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="d-flex flex-column">
        <div
          className="container d-flex flex-column"
          style={{
            height: "87vh",
          }}
        >
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
                        <img src="/done.svg" width="30" height="24" />
                      ) : null}
                    </span>
                  </Dropdown.Item>
                ))}
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
              onClick={() => pickRandom()}
              style={{
                cursor: "pointer",
              }}
            >
              <img src="/random.svg" width="30" height="24" />
              <span className="ms-2">Pick Random</span>
            </div>
          </div>
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th style={{ width: "40%" }}>
                  <div
                    className="d-flex justify-content-between"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      alert("implement sort");
                    }}
                  >
                    <span>Title</span>
                    <img src="/sort.svg" alt="React Bootstrap logo" />
                  </div>
                </th>
                <th style={{ width: "40%" }}>Tags</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {/* Kiểm tra nếu không có vấn đề nào trong Problems */}
              {filteredProblems.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center">
                    <strong>No problems found</strong>
                  </td>
                </tr>
              ) : (
                filteredProblems.map((problem) => (
                  <tr key={problem.id}>
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
      </div>
    </>
  );
}
