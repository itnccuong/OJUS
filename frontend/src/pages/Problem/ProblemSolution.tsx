import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch.ts";
import { ProblemWithUserStatusInterface} from "../../interfaces/interface.ts";
import Loader from "../../components/Loader.tsx";
import { languageEditorMap } from "../../utils/constanst.ts";
import { Editor } from "@monaco-editor/react";
import ReactMarkdown from "react-markdown";
import ProblemNav from "../../components/ProblemNav.tsx";

export default function ProblemSolution() {
  const { problemId } = useParams();
  const { data, loading } = useFetch<{ problem: ProblemWithUserStatusInterface }>(
    `/api/problems/${problemId}`,
    {
      includeToken: true,
    }
  );

  const Problem = data?.data.problem;
  console.log(Problem);
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="d-flex flex-grow-1 px-5 py-4 bg-body-tertiary">
      <div className="container-xxl d-flex">
        <div className="p-4 border rounded-4 round shadow-sm bg-white w-100">
          <ProblemNav problemId={problemId as string} />

          <h4 className="mt-3">Tutorial</h4>
          <div className="border rounded p-2">
            <ReactMarkdown
              children={
                Problem?.tutorial ||
                "Oops... No tutorial for this problem yet!"
              }
            />
          </div>

          <h4 className="mt-3">Solution</h4>
          <div
            className="border border-dark-subtle shadow-sm rounded-4 mt-3"
            style={{
              height: "40vh",
            }}
          >
            <div className="mt-3 mb-3">
              <Editor
                height="35vh"
                language={languageEditorMap[Problem?.langSolution || "C++"]}
                value={
                  Problem?.solution ||
                  "Oops... No solution for this problem yet!"
                }
                options={{
                  minimap: { enabled: false },
                  readOnly: true,
                  scrollbar: { vertical: "hidden", horizontal: "hidden" },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
