import { Link, useParams } from "react-router-dom";

import NavBar from "../components/NavBar";
import {
  Button,
  Dropdown,
  DropdownButton,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import ReactMarkdown from "react-markdown";
import React, { useState } from "react";

// import SyntaxHighlighter from "react-syntax-highlighter";
// import Editor from "react-simple-code-editor";
// import Prism from "prismjs";
// import "prismjs/themes/prism.css"; // Choose a Prism theme you like

// // Load the language you need
// import "prismjs/components/prism-javascript";

import CodeMirror from "@uiw/react-codemirror";
// import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { vscodeLight } from "@uiw/codemirror-theme-vscode";
// import { vscodeDarkStyle } from "@uiw/codemirror-theme-vscode";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";
import getURL from "../../utils/getURL.ts";
import { StorageConfig } from "../../interfaces/interface.ts";
import getStorage from "../../utils/getStorage.ts";
import { toast } from "react-toastify";

export default function Problem() {
  // const { id } = useParams();
  const id = 1;
  const { page } = useParams();
  const difficulty: string = "Medium";

  const Language = ["C++", "C", "Java", "Python", "Javascript"];

  const [language, setLanguage] = useState("Python");

  const tags: string[] = [
    "Array",
    "String",
    "Hash Table",
    "Dynamic Programming",
    "Math",
    "Sorting",
    "Greedy",
    "Depth-First Search",
    "Database",
    "Binary Search",
    "Matrix",
    "Tree",
    "Breadth-First Search",
  ];

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">Topics</Popover.Header>
      <Popover.Body>
        <div className="mb-3">
          {tags.map((tag, index) => (
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

  const [code, setCode] = useState("");
  const onChange = React.useCallback((val: string) => {
    setCode(val);
  }, []);

  const markdown = `
Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:

- \`'.'\` Matches any single character.
- \`'*'\` Matches zero or more of the preceding element.

The matching should cover the **entire** input string (not partial).

#### Example 1:
- **Input:** \`s = "aa"\`, \`p = "a"\`
- **Output:** \`false\`
- **Explanation:** \`"a"\` does not match the entire string \`"aa"\`.

#### Example 2:
- **Input:** \`s = "aa"\`, \`p = "a*"\`
- **Output:** \`true\`
- **Explanation:** \`'*'\` means zero or more of the preceding element, \`'a'\`. Therefore, by repeating \`'a'\` once, it becomes \`"aa"\`.

#### Example 3:
- **Input:** \`s = "ab"\`, \`p = ".*"\`
- **Output:** \`true\`
- **Explanation:** \`".*"\` means "zero or more (\`*\`) of any character (\`.\`)".

#### Constraints:
- \`1 <= s.length <= 20\`
- \`1 <= p.length <= 20\`
- \`s\` contains only lowercase English letters.
- \`p\` contains only lowercase English letters, \`'.'\`, and \`'*'\`.
- It is guaranteed for each appearance of the character \`'*'\`, there will be a previous valid character to match.
`;

  const storage: StorageConfig | null = getStorage(); // Get token from localStorage
  const token = storage?.token;

  const handleSubmit = async () => {
    try {
      const res = await toast.promise(
        axios.post(
          getURL(`/api/problems/${id}/submit`),
          {
            code: code,
            language: language,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
        {
          pending: "Submitting...",
          success: "Submit successfully!",
          // error: "Failed to submit",
        },
      );
      console.log("Submit response: ", res.data);
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div className="d-flex-flex-column">
      <NavBar />
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
        <Button onClick={() => handleSubmit()}>Submit</Button>
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
                  <h3 className="mb-3">
                    3. Longest Substring Without Repeating Characters
                  </h3>
                  <span
                    className={`badge bg-grey me-2 ${
                      difficulty === "Easy"
                        ? "text-success"
                        : difficulty === "Medium"
                          ? "text-warning"
                          : "text-danger"
                    }`}
                  >
                    {difficulty}
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

                  <ReactMarkdown className="mt-3">{markdown}</ReactMarkdown>
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
                            <img
                              src="/done.svg"
                              width="30"
                              height="24"
                              alt="React Bootstrap logo"
                            />
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
