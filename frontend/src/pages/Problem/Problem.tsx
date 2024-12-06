import { Link, useParams } from "react-router-dom";

import NavBar from "../../components/NavBar.tsx";
import {
  Button,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import React, { useEffect, useState } from "react";

import CodeMirror from "@uiw/react-codemirror";
// import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
// import { vscodeDarkStyle } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { toast } from "react-toastify";
import getToken from "../../../utils/getToken.ts";
import {
  OneProblemResponseInterface,
  ResponseInterface,
} from "../../../interfaces/response.interface.ts";
import axiosInstance from "../../../utils/getURL.ts";
import { ProblemWithUserStatusInterface } from "../../../interfaces/model.interface.ts";

export default function Problem() {
  const { page, id } = useParams();
  const token = getToken(); // Get token from localStorage
  const [fetchProblem, setFetchProblem] =
    useState<ProblemWithUserStatusInterface>();
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const onChange = React.useCallback((val: string) => {
    setCode(val);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (!token) {
          res = await axiosInstance.get<
            ResponseInterface<OneProblemResponseInterface>
          >(`/api/problems/no-account/${id}`, {});
        } else {
          res = await axiosInstance.get<
            ResponseInterface<OneProblemResponseInterface>
          >(`/api/problems/with-account/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
        console.log(res.data);
        setFetchProblem(res.data.data.problem);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  if (!fetchProblem) {
    return <div>Loading...</div>;
  }

  const difficultyMapping: Record<number, string> = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };

  const problem = {
    ...fetchProblem,
    difficulty: difficultyMapping[fetchProblem.difficulty],
    tags: fetchProblem.tags.split(","),
  };

  const Language = ["C++", "C", "Java", "Python", "Javascript"];

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Topics</Popover.Header>
      <Popover.Body>
        <div className="mb-3">
          {problem.tags.map((tag, index) => (
            <span
              key={index}
              className={`badge rounded-pill bg-grey text-dark m-1 mx-1`}
            >
              {tag}
            </span>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  //   const markdown = `
  // Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
  //
  // - \`'.'\` Matches any single character.
  // - \`'*'\` Matches zero or more of the preceding element.
  //
  // The matching should cover the **entire** input string (not partial).
  //
  // #### Example 1:
  // - **Input:** \`s = "aa"\`, \`p = "a"\`
  // - **Output:** \`false\`
  // - **Explanation:** \`"a"\` does not match the entire string \`"aa"\`.
  //
  // #### Example 2:
  // - **Input:** \`s = "aa"\`, \`p = "a*"\`
  // - **Output:** \`true\`
  // - **Explanation:** \`'*'\` means zero or more of the preceding element, \`'a'\`. Therefore, by repeating \`'a'\` once, it becomes \`"aa"\`.
  //
  // #### Example 3:
  // - **Input:** \`s = "ab"\`, \`p = ".*"\`
  // - **Output:** \`true\`
  // - **Explanation:** \`".*"\` means "zero or more (\`*\`) of any character (\`.\`)".
  //
  // #### Constraints:
  // - \`1 <= s.length <= 20\`
  // - \`1 <= p.length <= 20\`
  // - \`s\` contains only lowercase English letters.
  // - \`p\` contains only lowercase English letters, \`'.'\`, and \`'*'\`.
  // - It is guaranteed for each appearance of the character \`'*'\`, there will be a previous valid character to match.
  // `;

  const languageMap: Record<string, string> = {
    Python: "py",
    "C++": "cpp",
    C: "c",
    Java: "java",
    Javascript: "js",
  };

  const handleSubmit = async () => {
    try {
      const res = await toast.promise(
        axiosInstance.post(
          `/api/problems/${id}`,
          {
            code: code,
            language: languageMap[language],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
        {
          pending: "Submitting...",
          success: "All test cases passed",
          error: "Failed",
        },
      );
      console.log("Submit response: ", res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="d-flex-flex-column">
      <NavBar />
      <div
        className="d-flex gap-2"
        style={{
          position: "absolute",
          top: "10px", // Adjust this value to position vertically
          right: "50%",
          transform: "translateX(+50%)",
          zIndex: 10,
        }}
      >
        <Button onClick={() => handleSubmit()}>Submit</Button>
      </div>

      <div className="bg-light">
        <div className="d-flex container">
          <div
            className="container"
            style={{
              marginRight: "-15px",
            }}
          >
            <div className="border rounded bg-white mt-2">
              <div className="container border-bottom p-2 ps-3 d-flex gap-2">
                <Link
                  to={`/problems/${id}/description`}
                  style={{
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  Description
                </Link>
                <span className="text-body-tertiary ">|</span>
                <Link
                  to={`/problems/${id}/submissions`}
                  style={{
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  Submissions
                </Link>
              </div>

              {page === "description" ? (
                <div
                  className="container p-3"
                  style={{
                    height: "85vh", // Adjust this height as needed
                    overflowY: "auto",
                  }}
                >
                  <h3 className="mb-3">{problem.title}</h3>
                  <span
                    className={`badge bg-grey me-2 ${
                      problem.difficulty === "Easy"
                        ? "text-success"
                        : problem.difficulty === "Medium"
                          ? "text-warning"
                          : "text-danger"
                    }`}
                  >
                    {problem.difficulty}
                  </span>

                  <OverlayTrigger
                    trigger="hover"
                    placement="right"
                    overlay={popover}
                  >
                    <span
                      className="badge text-dark bg-grey"
                      style={{
                        cursor: "pointer",
                      }}
                    >
                      Topics
                    </span>
                  </OverlayTrigger>

                  <ReactMarkdown className="mt-3">
                    {problem.description}
                  </ReactMarkdown>
                </div>
              ) : (
                <div
                  className="container p-3"
                  style={{
                    height: "85vh", // Adjust this height as needed
                    overflowY: "auto",
                  }}
                >
                  <h3>Submission</h3>
                </div>
              )}
            </div>
          </div>
          <div className="container">
            <div className="border rounded bg-white mt-2">
              <div className="container border-bottom p-2 ps-3 d-flex gap-2">
                <DropdownButton variant="light" title={language}>
                  <div className="d-flex flex-column">
                    {Language.map((lang, index) => (
                      <Dropdown.Item
                        key={index}
                        onClick={() => {
                          setLanguage(lang);
                        }}
                      >
                        <Button variant="white">{lang}</Button>
                        <span className="ms-4">
                          {language === lang ? (
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
              </div>
              <div
                className="container p-3"
                style={{
                  height: "85vh", // Adjust this height as needed
                  overflowY: "auto",
                }}
              >
                <CodeMirror
                  value={code}
                  theme={vscodeLight}
                  extensions={[javascript()]}
                  style={{ fontSize: "16px" }}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
