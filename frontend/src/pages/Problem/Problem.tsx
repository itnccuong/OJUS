import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

import { toast } from "react-toastify";
import getToken from "../../../utils/getToken.ts";
import {
  OneProblemResponseInterface,
  ResponseInterface,
  SubmitCodeResponseInterface,
} from "../../../interfaces/response.interface.ts";
import axiosInstance from "../../../utils/getURL.ts";
import { ProblemWithUserStatusInterface } from "../../../interfaces/model.interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import ProblemNav from "../../components/ProblemNav.tsx";

export default function Problem() {
  const { problemId } = useParams();
  const token = getToken(); // Get token from localStorage
  const [fetchProblem, setFetchProblem] =
    useState<ProblemWithUserStatusInterface>();
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState<string | undefined>("");

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (!token) {
          res = await axiosInstance.get<
            ResponseInterface<OneProblemResponseInterface>
          >(`/api/problems/no-account/${problemId}`, {});
        } else {
          res = await axiosInstance.get<
            ResponseInterface<OneProblemResponseInterface>
          >(`/api/problems/with-account/${problemId}`, {
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
    1: "Bronze",
    2: "Platinum",
    3: "Master",
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
              className={`badge rounded-pill bg-body-secondary text-dark m-1 mx-1`}
            >
              {tag}
            </span>
          ))}
        </div>
      </Popover.Body>
    </Popover>
  );

  const languageMapBackend: Record<string, string> = {
    Python: "py",
    "C++": "cpp",
    C: "c",
    Java: "java",
    Javascript: "js",
  };

  const languageMapEditor: Record<string, string> = {
    Python: "python",
    "C++": "cpp",
    C: "c",
    Java: "java",
    Javascript: "javascript",
  };

  const handleSubmit = async () => {
    try {
      const res = await toast.promise(
        axiosInstance.post<ResponseInterface<SubmitCodeResponseInterface>>(
          `/api/problems/${problemId}`,
          {
            code: code,
            language: languageMapBackend[language],
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
      navigate(`/problems/${problemId}/submissions`);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Please login to submit your code");
        } else {
          const errorMessage = error.response?.data?.message;
          toast.error(errorMessage);
          navigate(`/problems/${problemId}/submissions`);
        }
      }
      console.error(error);
    }
  };

  return (
    <div className="d-flex justify-content-between flex-grow-1 bg-light px-5 py-4 gap-3">
      <div className="col-6 p-4 border rounded-4 round shadow-sm bg-white">
        <ProblemNav problemId={problemId as string} />
        <h3 className="mb-3 mt-3">{problem.title}</h3>
        <span
          className={`badge bg-body-secondary me-2 ${
            problem.difficulty === "Bronze"
              ? "text-warning-emphasis"
              : problem.difficulty === "Platinum"
                ? "text-primary"
                : "text-danger"
          }`}
        >
          {problem.difficulty}
        </span>

        <OverlayTrigger trigger="hover" placement="right" overlay={popover}>
          <span className="badge bg-body-secondary text-dark">Topics</span>
        </OverlayTrigger>

        <ReactMarkdown className="mt-3">{problem.description}</ReactMarkdown>
      </div>
      <div className="col-6 border rounded-4 round shadow-sm bg-white ">
        <div className="p-4 d-flex justify-content-between">
          <Button variant="primary" onClick={() => handleSubmit()}>
            Submit
          </Button>

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
                      <img src="/done.svg" width="30" height="24" alt="done" />
                    ) : null}
                  </span>
                </Dropdown.Item>
              ))}
            </div>
          </DropdownButton>
        </div>
        <div
        // style={{
        //   height: "83vh",
        // }}
        >
          <Editor
            height="73vh"
            language={languageMapEditor[language]}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              minimap: { enabled: false },
            }}
          />
        </div>
      </div>
    </div>
  );
}
