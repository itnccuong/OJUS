import {
  Accordion,
  Button,
  Form,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import {
  Accordion,
  Button,
  Form,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import getToken from "../../utils/getToken.ts";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { languageEditorMap, TagListInit } from "../../utils/constanst.ts";
import useSubmit from "../../hooks/useSubmit.ts";
import CustomSpinner from "../../components/CustomSpinner.tsx";
import { AxiosError } from "axios";
import { HelpCircle } from "lucide-react";
import JSZip from "jszip";
import { Editor } from "@monaco-editor/react";
import LanguageDropdown from "../../components/LanguageDropdown.tsx";

interface Tag {
  label: string;
  selected: boolean;
}

export default function Contribute() {
  //Check if user is logged in
  const navigate = useNavigate();
  const token = getToken();
  useEffect(() => {
    if (!token) {
      toast.error("You need to login to contribute");
      navigate("/accounts/login");
    }
  }, [token, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tutorial, setTutorial] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [timeLimit, setTimeLimit] = useState(1000); // Đặt giá trị mặc định cho Time Limit
  const [memoryLimit, setMemoryLimit] = useState(128); // Đặt giá trị mặc định cho Memory Limit
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState<string | undefined>("");

  const [testcaseError, setTestcaseError] = useState("");
  const [timeLimitError, setTimeLimitError] = useState("");
  const [memoryLimitError, setMemoryLimitError] = useState("");

  const [tags, setTags] = useState<Tag[]>(TagListInit);

  const toggleTag = (index: number) => {
    setTags((prevTags) =>
      prevTags.map((tag, i) =>
        i === index ? { ...tag, selected: !tag.selected } : tag
      )
    );
  };

  const handleResetTags = () => {
    setTags(TagListInit);
  };

  const [DescriptionMarkdown, setDescriptionMarkdown] = useState(false);
  const [TutorialMarkdown, setTutorialMarkdown] = useState(false);

  const { submit, isSubmitting } = useSubmit();

  const validateTestcase = async (file: File | null): Promise<boolean> => {
    setTestcaseError("");

    // Check if file exists
    if (!file) {
      setTestcaseError("Please upload a test case file");
      return false;
    }

    // Check file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "zip") {
      setTestcaseError("File must be a ZIP archive");
      return false;
    }

    try {
      const zip = new JSZip();
      const contents = await zip.loadAsync(file);

      const allFiles = Object.keys(contents.files);

      let testcaseFiles: string[] = [];

      // If all files are in a single folder (except the folder itself)
      const folders = allFiles
        .filter((path) => path.endsWith("/"))
        .map((path) => path.slice(0, -1)); // Remove trailing slash

      if (folders.length === 1) {
        // If there's exactly one folder, use files from there
        const folderPath = folders[0] + "/";
        testcaseFiles = allFiles
          .filter((name) => name.startsWith(folderPath))
          .map((name) => name.replace(folderPath, ""))
          .filter((name) => name !== "" && !name.includes("/")); // Remove empty strings and nested files
      } else if (folders.length === 0) {
        // If no folders, use root files
        testcaseFiles = allFiles.filter((name) => !name.includes("/"));
      } else {
        // Check if all non-root files are in a single folder
        const nonRootFiles = allFiles.filter((name) => name.includes("/"));
        const topLevelFolders = new Set(
          nonRootFiles.map((path) => path.split("/")[0])
        );

        if (topLevelFolders.size === 1) {
          const mainFolder = [...topLevelFolders][0] + "/";
          testcaseFiles = allFiles
            .filter((name) => name.startsWith(mainFolder))
            .map((name) => name.replace(mainFolder, ""))
            .filter((name) => name !== "" && !name.includes("/")); // Remove empty strings and nested files
        } else {
          setTestcaseError(
            "ZIP must contain either files in root or in a single folder"
          );
          return false;
        }
      }

      // Filter out directories
      testcaseFiles = testcaseFiles.filter((name) => !name.endsWith("/"));

      // Rest of the validation remains the same
      const validFilePattern = /^(input|output)\d+\.txt$/;
      const invalidFiles = testcaseFiles.filter(
        (name) => !validFilePattern.test(name)
      );

      if (invalidFiles.length > 0) {
        setTestcaseError(
          `Invalid files found: ${invalidFiles.join(", ")}. Only inputN.txt and outputN.txt files are allowed.`
        );
        return false;
      }

      // Group valid input and output files
      const inputFiles = testcaseFiles.filter(
        (name) => name.startsWith("input") && name.endsWith(".txt")
      );
      const outputFiles = testcaseFiles.filter(
        (name) => name.startsWith("output") && name.endsWith(".txt")
      );

      // Validation checks
      if (inputFiles.length === 0 || outputFiles.length === 0) {
        setTestcaseError(
          "ZIP must contain at least one pair of input/output files"
        );
        return false;
      }

      if (inputFiles.length !== outputFiles.length) {
        setTestcaseError(
          "Number of input files must match number of output files"
        );
        return false;
      }

      // Check matching pairs
      for (const inputFile of inputFiles) {
        const number = inputFile.match(/input(\d+)\.txt/)?.[1];
        if (!number) {
          setTestcaseError(
            "Input files must be named 'input1.txt', 'input2.txt', etc."
          );
          return false;
        }

        const matchingOutput = `output${number}.txt`;
        if (!outputFiles.includes(matchingOutput)) {
          setTestcaseError(`Missing matching output file for ${inputFile}`);
          return false;
        }
      }

      // All validations passed
      return true;
    } catch (error) {
      console.error("Error validating ZIP file:", error);
      setTestcaseError(
        "Error reading ZIP file. Please ensure it's a valid ZIP archive."
      );
      return false;
    }
  };

  const validateTimeLimit = (value: string): boolean => {
    setTimeLimitError("");
    const num = Number(value);

    if (value.trim() === "") {
      setTimeLimitError("Time limit is required");
      return false;
    }

    if (isNaN(num) || !Number.isInteger(num)) {
      setTimeLimitError("Time limit must be a valid number");
      return false;
    }

    if (num <= 0) {
      setTimeLimitError("Time limit must be greater than 0");
      return false;
    }

    return true;
  };

  const validateMemoryLimit = (value: string): boolean => {
    setMemoryLimitError("");
    const num = Number(value);

    if (value.trim() === "") {
      setMemoryLimitError("Memory limit is required");
      return false;
    }

    if (isNaN(num) || !Number.isInteger(num)) {
      setMemoryLimitError("Memory limit must be a valid number");
      return false;
    }

    if (num <= 0) {
      setMemoryLimitError("Memory limit must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isTimeLimitValid = validateTimeLimit(timeLimit.toString());
    const isMemoryLimitValid = validateMemoryLimit(memoryLimit.toString());

    if (!isTimeLimitValid || !isMemoryLimitValid) {
      return;
    }
    if (!(await validateTestcase(file))) {
      return;
    }

    try {
      const selectedTags = tags
        .filter((tag) => tag.selected)
        .map((tag) => tag.label)
        .join(",");

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("tutorial", tutorial);
      formData.append("difficulty", difficulty.toString());
      formData.append("timeLimit", timeLimit.toString());
      formData.append("memoryLimit", memoryLimit.toString());
      formData.append("tags", selectedTags);
      formData.append("solution", code || "");
      formData.append("langSolution", language);
      formData.append("file", file as Blob);

      const res = await submit("POST", "/api/contributions", formData, {
        includeToken: true,
      });
      toast.success("Contribution submitted");
      navigate("/contribute");

      console.log("Submit contribute response: ", res);
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      }
      console.error(err);
    }
  };

  const markdown = `
**1. Great titles are concise, descriptive, and specific.**

   ❌ Find Substring  
   ✅ Shortest Unsorted Continuous Subarray

---

**2. Clearly describe your question, and check our question set to make sure your problem isn’t already there.**

### Sample

Given an array of integers, return indices of the two numbers such that they add up to a specific target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**

Given \`nums = [2, 7, 11, 15]\`, \`target = 9\`,  
Because \`nums[0] + nums[1] = 2 + 7 = 9\`, return \`[0, 1]\`.
  `;

  const [showHelp, setShowHelp] = useState(false);

  const helpText = (
    <div className="p-2">
      <h6 className="mb-3">Test Files Requirements:</h6>
      <ol className="ps-3 mb-0">
        <li className="mb-2">
          Name format must be:
          <ul className="mt-1">
            <li>input1.txt, input2.txt, input3.txt...</li>
            <li>output1.txt, output2.txt, output3.txt...</li>
          </ul>
        </li>
        <li className="mb-2">Must be in a ZIP file</li>
        <li className="mb-2">Each input must have matching output</li>
        <li>Files must be in root of ZIP</li>
      </ol>
    </div>
  );

  const popover = (
    <Popover id="file-format-popover" className="w-72">
      <Popover.Body>{helpText}</Popover.Body>
    </Popover>
  );


  const [showHelp, setShowHelp] = useState(false);

  const helpText = (
    <div className="p-2">
      <h6 className="mb-3">Test Files Requirements:</h6>
      <ol className="ps-3 mb-0">
        <li className="mb-2">
          Name format must be:
          <ul className="mt-1">
            <li>input1.txt, input2.txt, input3.txt...</li>
            <li>output1.txt, output2.txt, output3.txt...</li>
          </ul>
        </li>
        <li className="mb-2">Must be in a ZIP file</li>
        <li className="mb-2">Each input must have matching output</li>
        <li>Files must be in root of ZIP</li>
      </ol>
    </div>
  );

  const popover = (
    <Popover id="file-format-popover" className="w-72">
      <Popover.Body>{helpText}</Popover.Body>
    </Popover>
  );

  return (
    <div className="flex-grow-1 d-flex px-5">
      <div className="d-flex container-xxl">
        <div className="col-8 d-flex flex-column p-3 border-end border-start">
          <h2
          // style={{
          //   fontSize: "28px",
          // }}
          >
            Submit your question
          </h2>

          <big className="text-muted mb-3">
            It's good to provide examples which will help users understand
            easily.
          </big>

          <h5 className="mt-3 mb-3">Title</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Control
              required
              type="text"
              placeholder="Pick a title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-50 mb-2"
            />

            <h5 className="mt-3 mb-3">Difficulty</h5>
            <Form.Select
              required
              aria-label="Default select example"
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-50 mb-2"
            >
              <option value={1}>Bronze</option>
              <option value={2}>Platinum</option>
              <option value={3}>Master</option>
            </Form.Select>

            <Accordion className="mt-3 mb-3 w-50">
              <Accordion.Item eventKey="0">
                <Accordion.Header>Tags</Accordion.Header>
                <Accordion.Body>
                  <div className="mb-3">
                    {tags.map((tag, index) => (
                      <Button
                        variant={tag.selected ? "primary" : "light"}
                        key={index}
                        className={`badge rounded-pill m-1 ${
                          tag.selected ? "" : "text-dark"
                        } mx-1`}
                        onClick={() => toggleTag(index)}
                        style={{ cursor: "pointer" }}
                      >
                        {tag.label}
                      </Button>
                    ))}
                  </div>
                  <div className="d-flex justify-content-end border-top">
                    <Button
                      variant="primary"
                      className=" w-25 mt-3"
                      onClick={() => handleResetTags()}
                    >
                      Reset
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>

            <h5 className="mt-3 mb-3">Description</h5>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Markdown Preview"
              onChange={(e) => setDescriptionMarkdown(e.target.checked)}
            />

            {DescriptionMarkdown ? (
              <>
                <div className="border rounded p-2">
                  <ReactMarkdown
                    children={description}
                    // remarkPlugins={[remarkMath]}
                    // rehypePlugins={[rehypeKatex]}
                  />
                  {/* {description} */}
                  {/* </ReactMarkdown> */}
                </div>
              </>
            ) : (
              <>
                <Form.Control
                  placeholder="Write your description in markdown"
                  className="mb-3 mt-2"
                  required
                  as="textarea"
                  rows={8}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </>
            )}

            <h5 className="mt-3 mb-3">Upload tests</h5>
            <div className="mb-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Form.Control
                  required
                  type="file"
                  className="w-50"
                  accept=".zip"
                  onChange={(e) => {
                    setFile((e.target as HTMLInputElement).files?.[0] || null);
                    validateTestcase(
                      (e.target as HTMLInputElement).files?.[0] || null
                    );
                  }}
                  isInvalid={!!testcaseError}
                />
                <Form.Control.Feedback type="invalid">
                  {testcaseError}
                </Form.Control.Feedback>
                <OverlayTrigger
                  trigger={["hover", "focus"]}
                  placement="right"
                  overlay={popover}
                  onToggle={(show) => setShowHelp(show)}
                  rootClose
                >
                  <div
                    className="d-flex align-items-center"
                    style={{ cursor: "help" }}
                  >
                    <HelpCircle
                      className={`text-primary ${showHelp ? "opacity-75" : ""}`}
                      size={25}
                    />
                  </div>
                </OverlayTrigger>
              </div>
            </div>

            <h5 className="mt-3 mb-3">Time limit (ms)</h5>
            <Form.Control
              required
              type="text"
              placeholder="Time limit"
              onChange={(e) => {
                const value = e.target.value;
                setTimeLimit(parseInt(value) || 0);
                validateTimeLimit(value);
              }}
              className="w-50 mb-2"
              isInvalid={!!timeLimitError}
            />
            <Form.Control.Feedback type="invalid">
              {timeLimitError}
            </Form.Control.Feedback>

            <h5 className="mt-3 mb-3">Memory limit (MB)</h5>
            <Form.Control
              required
              type="text"
              placeholder="Memory limit"
              onChange={(e) => {
                const value = e.target.value;
                setMemoryLimit(parseInt(value) || 0);
                validateMemoryLimit(value);
              }}
              className="w-50 mb-2"
              isInvalid={!!memoryLimitError}
            />
            <Form.Control.Feedback type="invalid">
              {memoryLimitError}
            </Form.Control.Feedback>

            <h5 className="mt-3 mb-3">Tutorial</h5>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Markdown Preview"
              onChange={(e) => setTutorialMarkdown(e.target.checked)}
            />

            {TutorialMarkdown ? (
              <>
                <div className="border rounded p-2">
                  <ReactMarkdown children={tutorial} />
                </div>
              </>
            ) : (
              <>
                <Form.Control
                  placeholder="Write your tutorial in markdown"
                  className="mb-3 mt-2"
                  required
                  as="textarea"
                  rows={8}
                  value={tutorial}
                  onChange={(e) => setTutorial(e.target.value)}
                />
              </>
            )}

            <h5 className="mt-3 mb-2">Solution</h5>
            <div
              className="border border-dark-subtle shadow-sm rounded-4 mt-3"
              style={{
                height: "50vh",
              }}
            >
              <div className="p-3 d-flex justify-content-between">
                <LanguageDropdown
                  language={language}
                  setLanguage={setLanguage}
                />
              </div>
              <div>
                <Editor
                  height="35vh"
                  language={languageEditorMap[language]}
                  value={code}
                  onChange={(value) => setCode(value)}
                  options={{
                    minimap: { enabled: false },
                  }}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <Button
                className="w-25"
                type={"submit"}
                variant="primary"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? <CustomSpinner /> : "Submit"}
              </Button>
            </div>
          </Form>
        </div>

        <div className="col-4 container-xxl p-3 border-bottom border-end bg-light">
          <div className="border border-3 p-3 mt-3 bg-white">
            <div className="mb-3">
              <img src="/lightbulb.svg" width="36" height="36" />
            </div>
            <ReactMarkdown>{markdown}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
