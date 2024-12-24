import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

import Editor from "@monaco-editor/react";

import Loader from "../../components/Loader.tsx";
import ProblemNav from "../../components/ProblemNav.tsx";
import { languageEditorMap } from "../../utils/constanst.ts";
import PopoverTag from "../../components/PopoverTag.tsx";
import DifficultyBadge from "../../components/DifficultyBadge.tsx";
import LanguageDropdown from "../../components/LanguageDropdown.tsx";
import useProblemData from "../../hooks/useProblemData.ts";
import useSubmitCodeProblem from "../../hooks/useSubmitCodeProblem.ts";
import NotFound from "../NotFound.tsx";

export default function Problem() {
  const { problemId } = useParams();
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState<string | undefined>("");

  const { problem, problemLoading } = useProblemData(problemId as string);
  const { submitProblem } = useSubmitCodeProblem();

  if (problemLoading) {
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
              variant="primary"
              onClick={() => submitProblem(code, language, problemId as string)}
            >
              Submit
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
