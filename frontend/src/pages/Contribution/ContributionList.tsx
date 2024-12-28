import { Button, Dropdown, DropdownButton, Form, Table } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ProblemWithUserStatusInterface } from "../../interfaces/interface.ts";
import Loader from "../../components/Loader.tsx";
import { difficultyMapping, Tag, TagListInit } from "../../utils/constanst.ts";
import useFetch from "../../hooks/useFetch.ts";
import { splitString } from "../../utils/general.ts";

export default function ContributionList() {
  const navigate = useNavigate();

  const [tags, setTags] = useState<Tag[]>(TagListInit);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [status, setStatus] = useState("All");

  const { data, loading } = useFetch<{
    contributions: ProblemWithUserStatusInterface[];
  }>(`/api/contributions/`, {
    includeToken: true,
  });

  const fetchContributions = data?.data.contributions;

  if (loading || !fetchContributions) {
    return <Loader />;
  }

  const toggleTag = (index: number) => {
    setTags((prevTags) =>
      prevTags.map((tag, i) =>
        i === index ? { ...tag, selected: !tag.selected } : tag,
      ),
    );
  };

  const handleResetTags = () => {
    setTags(TagListInit);
  };

  const pickRandom = () => {
    const randomProblem =
      contributions[Math.floor(Math.random() * contributions.length)];
    navigate(`/contributions/${randomProblem.problemId}/description`);
  };

  const contributions = fetchContributions.map((fetchContribution) => {
    const statusMapping: Record<string, string> = {
      false: "Todo",
      true: "Solved",
    };

    return {
      ...fetchContribution,
      userStatus: statusMapping[fetchContribution.userStatus.toString()],
      difficulty: difficultyMapping[fetchContribution.difficulty],
      tags: splitString(fetchContribution.tags),
    };
  });

  const Difficulty = ["Bronze", "Platinum", "Master"];

  const getSelectedTags = () =>
    tags.filter((tag) => tag.selected).map((tag) => tag.label);

  const filteredContributions = contributions.filter(
    (contribution) =>
      (contribution.difficulty === difficulty || difficulty === "All") &&
      (contribution.userStatus === status || status === "All") &&
      getSelectedTags().every((tag) => contribution.tags.includes(tag)) &&
      contribution.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="d-flex flex-grow-1 py-4 px-5">
      <div className="container-xxl">
        <div className="d-flex flex-row align-items-center gap-2">
          <DropdownButton variant="secondary" title="Difficulty">
            <div>
              {Difficulty.map((diff, index) => (
                <Dropdown.Item
                  className="d-flex justify-content-between px-3 py-2"
                  key={index}
                  onClick={() => {
                    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                    difficulty === diff
                      ? setDifficulty("All")
                      : setDifficulty(diff);
                  }}
                >
                  <div
                    // variant="white"
                    className={`text-${
                      diff === "Bronze"
                        ? "warning-emphasis"
                        : diff === "Platinum"
                          ? "primary"
                          : "danger"
                    }`}
                  >
                    {diff}
                  </div>
                  <span>
                    {difficulty === diff ? (
                      <img src="/done.svg" width="30" height="24" />
                    ) : null}
                  </span>
                </Dropdown.Item>
              ))}
            </div>
          </DropdownButton>

          <DropdownButton variant="secondary" title="Status">
            <div>
              <Dropdown.Item
                className="d-flex justify-content-between px-3 py-2"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  status === "Solved" ? setStatus("All") : setStatus("Solved");
                }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <img src="/accept.png" width="20" height="20" />
                  <span className="text-success">Solved</span>
                </div>
                <span>
                  {status === "Solved" ? (
                    <img src="/done.svg" width="30" height="24" />
                  ) : null}
                </span>
              </Dropdown.Item>

              <Dropdown.Item
                className="d-flex justify-content-between px-3 py-2"
                onClick={() => {
                  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                  status === "Todo" ? setStatus("All") : setStatus("Todo");
                }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <img src="/reject.png" width="20" height="20" />
                  <span className="text-danger">To do</span>
                </div>
                <span>
                  {status === "Todo" ? (
                    <img src="/done.svg" width="30" height="24" />
                  ) : null}
                </span>
              </Dropdown.Item>
            </div>
          </DropdownButton>

          <DropdownButton variant="secondary" title="Tags">
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
                  onClick={() => {
                    alert("implement sort");
                  }}
                >
                  <span>Title</span>
                  <img src="/sort.svg" />
                </div>
              </th>
              {/* </div> */}
              <th style={{ width: "40%" }}>Tags</th>
              <th className="text-center">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {filteredContributions.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  <strong>No problems found</strong>
                </td>
              </tr>
            ) : (
              filteredContributions.map((problem) => (
                <tr
                  key={problem.problemId}
                  onClick={() =>
                    navigate(`/contributions/${problem.problemId}/description`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <td className="text-center">
                    {problem.userStatus === "Solved" ? (
                      <img src="/accept.png" width="20" height="20" />
                    ) : (
                      <img src="/reject.png" width="20" height="20" />
                    )}
                  </td>
                  <td>{problem.title}</td>

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

                  <td className="text-center">
                    <span
                      className={`badge fs-6 ${
                        problem.difficulty === "Bronze"
                          ? "text-warning-emphasis"
                          : problem.difficulty === "Platinum"
                            ? "text-primary"
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
  );
}
