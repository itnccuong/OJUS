import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

import Editor from "@monaco-editor/react";

import Loader from "../../components/Loader.tsx";
import { languageEditorMap } from "../../../utils/constanst.ts";
import PopoverTag from "../../components/PopoverTag.tsx";
import DifficultyBadge from "../../components/DifficultyBadge.tsx";
import LanguageDropdown from "../../components/LanguageDropdown.tsx";
import NotFound from "../NotFound.tsx";
import ContributionNav from "../../components/ContributionNav.tsx";
import useContributionData from "../../hooks/useContributionData.ts";
import useSubmitCodeContribution from "../../hooks/useSubmitCodeContribution.ts";
import axiosInstance from "../../../utils/getURL.ts";
import { toast } from "react-toastify";
import {
  ProblemInterface,
  ResponseInterface,
} from "../../../interfaces/interface.ts";
import getToken from "../../../utils/getToken.ts";
import { AxiosError } from "axios";

export default function Contribution() {
  const { problemId } = useParams();
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState<string | undefined>("");
  const navigate = useNavigate();
  const { problem, loading } = useContributionData(problemId as string);
  const { submitProblem } = useSubmitCodeContribution();

  if (loading) {
    return <Loader />;
  }

  if (!problem) {
    return <NotFound />;
  }

  const handleAccept = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const { data } = await toast.promise(
        axiosInstance.put<
          ResponseInterface<{ contribution: ProblemInterface }>
        >(
          `/api/contributions/${problemId}/accept`,
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
    const token = getToken();
    if (!token) {
      toast.error("Please login first");
      return;
    }
    try {
      const { data } = await toast.promise(
        axiosInstance.put<
          ResponseInterface<{ contribution: ProblemInterface }>
        >(
          `/api/contributions/${problemId}/reject`,
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
  return (
    <div className="d-flex flex-grow-1 bg-body-tertiary px-5 py-4">
      <div className="container-xxl d-flex justify-content-between gap-3">
        <div className="col-6 p-4 border rounded-4 round shadow-sm bg-white">
          <ContributionNav problemId={problemId as string} />
          <h3 className="mb-3 mt-3">{problem.title}</h3>
          <DifficultyBadge difficulty={problem.difficulty} />

          <PopoverTag tags={problem.tags} />

          <ReactMarkdown className="mt-3">{problem.description}</ReactMarkdown>
        </div>

        <div className="col-6 border rounded-4 round shadow-sm bg-white pb-2">
          <div className="p-4 d-flex justify-content-between align-items-center">
            <Button
              variant="primary"
              onClick={() => submitProblem(code, language, problemId as string)}
            >
              Submit
            </Button>

            <div className="d-flex gap-3">
              <Button variant="danger" onClick={() => handleReject()}>
                Reject
              </Button>
              <Button variant="success" onClick={() => handleAccept()}>
                Accept
              </Button>
            </div>
            <div
              className="d-flex justify-content-end"
              style={{
                width: "75px",
              }}
            >
              <LanguageDropdown language={language} setLanguage={setLanguage} />
            </div>
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
