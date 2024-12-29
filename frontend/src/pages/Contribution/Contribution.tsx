import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

import Editor from "@monaco-editor/react";

import Loader from "../../components/Loader.tsx";
import {
  language_FE_to_BE_map,
  languageEditorMap,
} from "../../utils/constanst.ts";
import PopoverTag from "../../components/PopoverTag.tsx";
import DifficultyBadge from "../../components/DifficultyBadge.tsx";
import LanguageDropdown from "../../components/LanguageDropdown.tsx";
import NotFound from "../NotFound.tsx";
import ContributionNav from "../../components/ContributionNav.tsx";
import useFetch from "../../hooks/useFetch.ts";
import { ProblemInterface } from "../../interfaces/interface.ts";
import useSubmit from "../../hooks/useSubmit.ts";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import CustomSpinner from "../../components/CustomSpinner.tsx";

export default function Contribution() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState<string | undefined>("");

  const { data, loading } = useFetch<{ contribution: ProblemInterface }>(
    `/api/contributions/${problemId}`,
    {
      includeToken: true,
    },
  );
  const problem = data?.data.contribution;

  const { submit, isSubmitting } = useSubmit();
  const handleSubmit = async () => {
    try {
      const res = await submit<{ submissionId: number }>(
        "POST",
        `/api/problems/${problemId}`,
        {
          code,
          language: language_FE_to_BE_map[language],
        },
        {
          includeToken: true,
        },
      );

      console.log("Submit response: ", res);
      const submissionId = res.submissionId;
      navigate(`/submissions/${submissionId}`);
    } catch (error) {
      console.error(error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          toast.error("Please login to submit your code");
        } else if (error.response?.status === 400) {
          const submissionId = error.response.data.data.submissionId;
          navigate(`/submissions/${submissionId}`);
        }
      }
    }
  };
  const { submit: accept, isSubmitting: acceptLoading } = useSubmit();
  const { submit: reject, isSubmitting: rejectLoading } = useSubmit();

  const adjudicateHandler = async (isAccept: boolean) => {
    try {
      const res = isAccept
        ? await accept<{ data: string }>(
            "PATCH",
            `/api/contributions/${problemId}/accept`,
            {},
            {
              includeToken: true,
            },
          )
        : await reject<{ data: string }>(
            "PATCH",
            `/api/contributions/${problemId}/reject`,
            {},
            {
              includeToken: true,
            },
          );
      toast.success(`Contribution ${isAccept ? "accepted" : "rejected"}`);
      navigate("/contributions");
      console.log("Adjudicate response:", res);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          navigate("/notadmin");
        }
      }
      console.error(error);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!problem) {
    return <NotFound />;
  }

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
              style={{ width: "80px" }}
              variant="primary"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
            >
              {isSubmitting ? <CustomSpinner /> : "Submit"}
            </Button>

            <div className="d-flex gap-3">
              <Button
                style={{ width: "80px" }}
                variant="danger"
                disabled={rejectLoading}
                onClick={() => adjudicateHandler(false)}
              >
                {rejectLoading ? <CustomSpinner /> : "Reject"}
              </Button>

              <Button
                style={{ width: "80px" }}
                variant="success"
                disabled={acceptLoading}
                onClick={() => adjudicateHandler(true)}
              >
                {acceptLoading ? <CustomSpinner /> : "Accept"}
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
