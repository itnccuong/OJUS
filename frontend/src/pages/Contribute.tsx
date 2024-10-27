import { Button, Container, Form } from "react-bootstrap";
import NavBar from "../components/NavBar";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Footer from "../components/Footer";
import { StorageConfig } from "../../interfaces/interface";
import getStorage from "../../utils/getStorage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Contribute() {
  const navigate = useNavigate(); // Initialize navigate
  const storage: StorageConfig | null = getStorage(); // Get token from localStorage

  useEffect(() => {
    if (!storage) {
      toast.error("You need to login first");
      navigate("/accounts/login");
    }
  }, [storage, navigate]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");

  const [inputFile, setInputFile] = useState<File | null>(null);
  const [outputFile, setOutputFile] = useState<File | null>(null);

  const [isMarkdown, setIsMarkdown] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log("submit", inputFile?.name, outputFile?.name);
      // const { data } = await axios.post(getURL("/api/contribute"), {
      //   title,
      //   description,
      // });
      // console.log("data", data);
      toast.success("Your question has been submitted");
      //   navigate("/problem");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message);
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
  return (
    <div className="d-flex flex-column">
      <NavBar />
      <Form onSubmit={handleSubmit}>
        <Container
          className="d-flex"
          style={
            {
              // height: "100vh",
            }
          }
        >
          <Container
            className="d-flex flex-column p-3 border-end border-start"
            style={
              {
                //   minHeight: "100vh",
              }
            }
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

            <h5 className="mt-3 mb-3">Title</h5>

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
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-50 mb-2"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </Form.Select>

            <h5 className="mt-3 mb-3">Description</h5>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Markdown Preview"
              onChange={(e) => setIsMarkdown(e.target.checked)}
            />

            {isMarkdown ? (
              <>
                <Container className="border rounded mb-3 mt-2">
                  <ReactMarkdown>{description}</ReactMarkdown>
                </Container>
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

            <h5 className="mt-3 mb-3">Input File</h5>
            <Form.Control
              required
              type="file"
              className="mb-3 w-50"
              onChange={(e) =>
                setInputFile((e.target as HTMLInputElement).files?.[0] || null)
              }
            />

            <h5 className="mt-3 mb-3">Output File</h5>
            <Form.Control
              required
              type="file"
              className="mb-3 w-50"
              onChange={(e) =>
                setOutputFile((e.target as HTMLInputElement).files?.[0] || null)
              }
            />

            <Container className="d-flex justify-content-center mt-2">
              <Button className="w-25" type="submit">
                Submit
              </Button>
            </Container>
          </Container>

          <Container
            className="p-3 border-bottom border-end"
            style={{
              width: "550px",
              backgroundColor: "#fbfbfb",
            }}
          >
            <Container
              className="border border-3 p-3 mt-3"
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
            </Container>
          </Container>
        </Container>
      </Form>
      <Container>
        <Footer />
      </Container>
    </div>
  );
}
