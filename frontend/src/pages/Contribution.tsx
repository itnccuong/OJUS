import { Link, NavLink, useNavigate, useParams } from "react-router-dom";

import NavBar from "../components/NavBar";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap";
import { StorageConfig } from "../../interfaces/interface";
import getStorage from "../../utils/getStorage";
import ReactMarkdown from "react-markdown";
import { useState } from "react";

// import SyntaxHighlighter from "react-syntax-highlighter";
// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Contribution() {
  const { id } = useParams();
  const { page } = useParams();

  const [code, setCode] = useState("");

  const markdown = `
Given a string \`s\`, find the length of the **longest substring** without repeating characters.

#### Example 1:
- **Input**: \`s = "abcabcbb"\`
- **Output**: \`3\`
- **Explanation**: The answer is \`"abc"\`, with the length of \`3\`.

#### Example 2:
- **Input**: \`s = "bbbbb"\`
- **Output**: \`1\`
- **Explanation**: The answer is \`"b"\`, with the length of \`1\`.

#### Example 3:
- **Input**: \`s = "pwwkew"\`
- **Output**: \`3\`
- **Explanation**: The answer is \`"wke"\`, with the length of \`3\`.  
  Notice that the answer must be a substring, \`"pwke"\` is a subsequence and not a substring.

#### Constraints:
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols, and spaces.

Given a string \`s\`, find the length of the **longest substring** without repeating characters.

#### Example 1:
- **Input**: \`s = "abcabcbb"\`
- **Output**: \`3\`
- **Explanation**: The answer is \`"abc"\`, with the length of \`3\`.

#### Example 2:
- **Input**: \`s = "bbbbb"\`
- **Output**: \`1\`
- **Explanation**: The answer is \`"b"\`, with the length of \`1\`.

#### Example 3:
- **Input**: \`s = "pwwkew"\`
- **Output**: \`3\`
- **Explanation**: The answer is \`"wke"\`, with the length of \`3\`.  
  Notice that the answer must be a substring, \`"pwke"\` is a subsequence and not a substring.

#### Constraints:
- \`0 <= s.length <= 5 * 10^4\`
- \`s\` consists of English letters, digits, symbols, and spaces.
`;

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
        <Button variant="danger">Reject</Button>
        <Button>Run</Button>
        <Button variant="success">Accept</Button>
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
                  to={`/contributions/${id}/description`}
                  style={{
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  Description
                </Link>
                <span className="text-body-tertiary ">|</span>
                <Link
                  to={`/contributions/${id}/submissions`}
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
                  <h3>3. Longest Substring Without Repeating Characters</h3>
                  <ReactMarkdown>{markdown}</ReactMarkdown>
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
                <span>Code</span>
              </div>
              <div
                className="container p-3"
                style={{
                  height: "85vh", // Adjust this height as needed
                  overflowY: "auto",
                }}
              >
                <Form.Control
                  style={{
                    border: "none",
                    boxShadow: "none",
                    resize: "none",
                  }}
                  //   placeholder="Write your description in markdown"
                  className=""
                  as="textarea"
                  rows={26}
                  //   value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </div>
            </div>

            {/* <SyntaxHighlighter language="javascript" style={docco}>
              {code}
            </SyntaxHighlighter> */}
          </div>
        </div>
      </div>
    </div>
  );
}
