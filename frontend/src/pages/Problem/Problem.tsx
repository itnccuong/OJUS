import { useNavigate, useParams } from "react-router-dom";

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
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import Footer from "../../components/Footer.tsx";

export default function Problem() {
  const { id } = useParams();
  const token = getToken(); // Get token from localStorage
  const [fetchProblem, setFetchProblem] =
    useState<ProblemWithUserStatusInterface>();
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const onChange = React.useCallback((val: string) => {
    setCode(val);
  }, []);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
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

  if (loading || !fetchProblem) {
    return <Loader />;
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
        },
      );
      console.log("Submit response: ", res.data);
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

  return (
    <div className="d-flex-flex-column">
      <NavBar />

      <div className="bg-light p-3">
        <div className="container">
          <div className="d-flex gap-2 mb-3">
            <Button
              variant="secondary"
              onClick={() => navigate(`/problems/${id}/description`)}
            >
              Description
            </Button>
            <Button
              variant="secondary"
              onClick={() => navigate(`/problems/${id}/submissions`)}
            >
              Submission
            </Button>
          </div>
          <div
            className="d-flex justify-content-between gap-2"
            style={{ minHeight: "76vh" }}
          >
            <div className="container p-3 border rounded-4 round shadow-sm bg-white">
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
            <div className="container p-3 border rounded-4 round shadow-sm bg-white">
              <div className="mb-3 d-flex justify-content-between">
                <Button onClick={() => handleSubmit()}>Submit</Button>

                <DropdownButton variant="secondary" title={language}>
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
                              alt="done"
                            />
                          ) : null}
                        </span>
                      </Dropdown.Item>
                    ))}
                  </div>
                </DropdownButton>
              </div>
              <div>
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
      <Footer />
    </div>
    // </div>
  );
}
