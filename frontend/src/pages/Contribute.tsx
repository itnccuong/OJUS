import { Container, Form } from "react-bootstrap";
import NavBar from "../components/NavBar";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import Footer from "../components/Footer";

export default function Contribute() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isMarkdown, setIsMarkdown] = useState(false);
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
Because [\`nums[0] + nums[1] = 2 + 7 = 9\`], return \`[0, 1]\`.
  `;
  return (
    <>
      <NavBar />
      <Container
        className="d-flex"
        style={{
          height: "100vh",
        }}
      >
        <Container
          className="d-flex flex-column p-3 border-end"
          style={{
            minHeight: "100vh",
          }}
        >
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

          <h5 className="mt-4 mb-3">Title *</h5>

          <Form.Control
            required
            type="text"
            placeholder="Pick a title"
            onChange={(e) => setTitle(e.target.value)}
            className="w-50 mb-2"
          />

          <h5 className="mt-4 mb-3">Description *</h5>
          <Form.Check
            type="switch"
            id="custom-switch"
            label="Markdown Preview"
            onChange={(e) => setIsMarkdown(e.target.checked)}
          />

          {isMarkdown ? (
            <>
              <Container className="border rounded">
                <ReactMarkdown>{description}</ReactMarkdown>
              </Container>
            </>
          ) : (
            <>
              <Form.Control
                className="mb-2"
                required
                as="textarea"
                rows={8}
                // placeholder="Pick a title"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </>
          )}
        </Container>

        <Container
          className="p-3 border-bottom border-end"
          style={{
            width: "550px",
            backgroundColor: "#fbfbfb",
          }}
        >
          <Container
            className="d-flex flex-column border border-3 p-3 mt-3"
            style={{
              backgroundColor: "white",
            }}
          >
            <div className="mb-3">
              <img
                src="/lightbulb.svg"
                width="36"
                height="36"
                alt="React Bootstrap logo"
              />
            </div>
            <ReactMarkdown>{markdown}</ReactMarkdown>
            {/* <p>
              1. Great titles are concise, descriptive, and specific. Find
              Substring Shortest Unsorted Continuous Subarray 2. Clearly
              describe your question, and check our question set to make sure
              your problem isn’t already there. Sample Given an array of
              integers, return indices of the two numbers such that they add up
              to a specific target. You may assume that each input would have
              exactly one solution, and you may not use the same element twice.
              Example: Given nums = [2, 7, 11, 15], target = 9, Because nums[0]
              + nums[1] = 2 + 7 = 9, return [0, 1].
            </p> */}
          </Container>
        </Container>
      </Container>
      <Container>
        <Footer />
      </Container>
    </>
  );
}
