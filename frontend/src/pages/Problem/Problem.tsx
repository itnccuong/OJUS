import { useNavigate, useParams } from "react-router-dom";
import { Button, Dropdown, DropdownButton } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

import { toast } from "react-toastify";
import getToken from "../../../utils/getToken.ts";
import axiosInstance from "../../../utils/getURL.ts";
import {
  ProblemWithUserStatusInterface,
  ResponseInterface,
} from "../../../interfaces/interface.ts";
import Loader from "../../components/Loader.tsx";
import { AxiosError } from "axios";
import ProblemNav from "../../components/ProblemNav.tsx";
import {
  difficultyMapping,
  languageEditorMap,
  languageFeToBeMap,
  LanguageList,
} from "../../../utils/constanst.ts";
import PopoverTag from "../../components/PopoverTag.tsx";

export default function Problem() {
  const { problemId } = useParams();
  const token = getToken();
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
            ResponseInterface<{ problem: ProblemWithUserStatusInterface }>
          >(`/api/problems/no-account/${problemId}`, {});
        } else {
          res = await axiosInstance.get<
            ResponseInterface<{ problem: ProblemWithUserStatusInterface }>
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

  const problem = {
    ...fetchProblem,
    difficulty: difficultyMapping[fetchProblem.difficulty],
    tags: fetchProblem.tags.split(","),
  };

  const handleSubmit = async () => {
    try {
      const res = await toast.promise(
        axiosInstance.post<ResponseInterface<{ submissionId: number }>>(
          `/api/problems/${problemId}`,
          {
            code: code,
            language: languageFeToBeMap[language],
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
    <div className="d-flex flex-grow-1 bg-body-tertiary px-5 py-4">
      <div className="container-xxl d-flex justify-content-between gap-3">
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

          <PopoverTag tags={problem.tags} />

          <ReactMarkdown className="mt-3">{problem.description}</ReactMarkdown>
        </div>
        <div className="col-6 border rounded-4 round shadow-sm bg-white pb-2">
          <div className="p-4 d-flex justify-content-between">
            <Button variant="primary" onClick={() => handleSubmit()}>
              Submit
            </Button>

            <DropdownButton variant="secondary" title={language}>
              <div className="d-flex flex-column">
                {LanguageList.map((lang, index) => (
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
            <Editor
              height="69vh"
              language={languageEditorMap[language]}
              value={code}
              onChange={(value) => setCode(value)}
              options={{
                minimap: { enabled: false },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
