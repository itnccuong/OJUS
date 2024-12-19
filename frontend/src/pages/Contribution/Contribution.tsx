import { Link, useNavigate, useParams } from "react-router-dom";

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
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import { toast } from "react-toastify";
import getToken from "../../../utils/getToken.ts";
import {
  OneContributionResponseInterface,
  ResponseInterface,
} from "../../../interfaces/response.interface.ts";
import axiosInstance from "../../../utils/getURL.ts";
import { ProblemInterface } from "../../../interfaces/model.interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";

export default function Contribution() {
  const navigate = useNavigate(); // Initialize navigate
  const token = getToken(); // Get token from localStorage
  const { id, page } = useParams();
  const [code, setCode] = useState("");
  const onChange = React.useCallback((val: string) => {
    setCode(val);
  }, []);

  const Language = ["C++", "C", "Java", "Python", "Javascript"];

  const [language, setLanguage] = useState("Python");

  useEffect(() => {
    if (!token) {
      navigate("/accounts/login");
    }
  }, [token, navigate]);

  const [fetchContribution, setFetchContribution] =
    useState<ProblemInterface>();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get<
          ResponseInterface<OneContributionResponseInterface>
        >(`/api/contributions/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(res.data);
        setFetchContribution(res.data.data.contribution);
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
    fetchData();
  }, []);

  if (loading || !fetchContribution) {
    return <Loader />;
  }

  const difficultyMapping: Record<number, string> = {
    1: "Easy",
    2: "Medium",
    3: "Hard",
  };

  const contribution = {
    ...fetchContribution,
    difficulty: difficultyMapping[fetchContribution.difficulty],
    tags: fetchContribution.tags.split(","),
  };

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Topics</Popover.Header>
      <Popover.Body>
        <div className="mb-3">
          {contribution.tags.map((tag, index) => (
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
        },
      );
      console.log("Submit response: ", res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  const handleAccept = async () => {
    try {
      const { data } = await toast.promise(
        axiosInstance.put<ResponseInterface<OneContributionResponseInterface>>(
          `/api/contributions/${id}/accept`,
          {},
          {
            // Config object
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        ),
        {
          pending: "Loading...",
          success: "Contribution accepted",
        },
      );
      navigate("/contributions");

      console.log("Accept response:", data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.data?.name === "UNAUTHORIZED") {
          toast.error("Please login to submit your code");
          navigate("/accounts/login");
        } else {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
        }
      }
      console.error(error);
    }
  };

  const handleReject = async () => {
    try {
      const { data } = await toast.promise(
        axiosInstance.put<ResponseInterface<OneContributionResponseInterface>>(
          `/api/contributions/${id}/reject`,
          {},
          {
            // Config object
            headers: {
              Authorization: "Bearer " + token,
            },
          },
        ),
        {
          pending: "Loading...",
          success: "Contribution rejected",
        },
      );
      navigate("/contributions");

      console.log("Accept response:", data);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };

  //   const markdown = `
  // Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:
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

  return (
    <div className="d-flex-flex-column">
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
        <Button variant="danger" onClick={handleReject}>
          Reject
        </Button>
        <Button onClick={() => handleSubmit()}>Submit</Button>
        <Button variant="success" onClick={handleAccept}>
          Accept
        </Button>
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
                  <h3 className="mb-3">{contribution.title}</h3>
                  <span
                    className={`badge bg-grey me-2 ${
                      contribution.difficulty === "Easy"
                        ? "text-success"
                        : contribution.difficulty === "Medium"
                          ? "text-warning"
                          : "text-danger"
                    }`}
                  >
                    {contribution.difficulty}
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
                    {contribution.description}
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
                            <img src="/done.svg" width="30" height="24" />
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
