import { useNavigate, useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

import Editor from "@monaco-editor/react";

import Loader from "../../components/Loader.tsx";
import ProblemNav from "../../components/ProblemNav.tsx";
import {
  language_FE_to_BE_map,
  languageEditorMap,
} from "../../utils/constanst.ts";
import PopoverTag from "../../components/PopoverTag.tsx";
import DifficultyBadge from "../../components/DifficultyBadge.tsx";
import LanguageDropdown from "../../components/LanguageDropdown.tsx";
import NotFound from "../NotFound.tsx";
import getToken from "../../utils/getToken.ts";
import useFetch from "../../hooks/useFetch.ts";
import { ProblemWithUserStatusInterface } from "../../interfaces/interface.ts";
import useSubmit from "../../hooks/useSubmit.ts";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import CustomSpinner from "../../components/CustomSpinner.tsx";

export default function Problem() {
  const navigate = useNavigate();
  const { problemId } = useParams();
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState<string | undefined>("");

  const token = getToken();
  const { data, loading } = useFetch<{
    problem: ProblemWithUserStatusInterface;
  }>(
    token
      ? `/api/problems/with-account/${problemId}`
      : `/api/problems/no-account/${problemId}`,
    {
      includeToken: !!token,
    },
  );
  const problem = data?.data.problem;

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
          <ProblemNav problemId={problemId as string} />
          <h3 className="mb-3 mt-3">{problem.title}</h3>
          <DifficultyBadge difficulty={problem.difficulty} />

          <PopoverTag tags={problem.tags} />

          <ReactMarkdown className="mt-3">{problem.description}</ReactMarkdown>
        </div>

        <div className="col-6 border rounded-4 round shadow-sm bg-white pb-2">
          <div className="p-4 d-flex justify-content-between">
            <Button
              style={{ width: "80px" }}
              variant="primary"
              disabled={isSubmitting}
              onClick={() => handleSubmit()}
            >
              {isSubmitting ? <CustomSpinner /> : "Submit"}
            </Button>

            <LanguageDropdown language={language} setLanguage={setLanguage} />
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
