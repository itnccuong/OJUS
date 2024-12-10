import { Accordion, Button, Container, Form } from "react-bootstrap";
import NavBar from "../../components/NavBar.tsx";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import Footer from "../../components/Footer.tsx";
import { toast } from "react-toastify";
import getToken from "../../../utils/getToken.ts";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/getURL.ts";
import { AxiosError } from "axios";

interface Tag {
  label: string;
  selected: boolean;
}

export default function Contribute() {
  //Check if user is logged in
  const navigate = useNavigate();
  const token = getToken();
  console.log(token);
  useEffect(() => {
    if (!token) {
      toast.error("You need to login to contribute");
      navigate("/accounts/login");
    }
  }, [token, navigate]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [timeLimit, setTimeLimit] = useState(1000); // Đặt giá trị mặc định cho Time Limit
  const [memoryLimit, setMemoryLimit] = useState(128); // Đặt giá trị mặc định cho Memory Limit

  const initialTags: Tag[] = [
    { label: "Array", selected: false },
    { label: "String", selected: false },
    { label: "Hash Table", selected: false },
    { label: "Dynamic Programming", selected: false },
    { label: "Math", selected: false },
    { label: "Sorting", selected: false },
    { label: "Greedy", selected: false },
    { label: "Depth-First Search", selected: false },
    { label: "Database", selected: false },
    { label: "Binary Search", selected: false },
    { label: "Matrix", selected: false },
    { label: "Tree", selected: false },
    { label: "Breadth-First Search", selected: false },
  ];

  const [tags, setTags] = useState<Tag[]>(initialTags);

  const toggleTag = (index: number) => {
    setTags((prevTags) =>
      prevTags.map((tag, i) =>
        i === index ? { ...tag, selected: !tag.selected } : tag,
      ),
    );
  };

  const handleResetTags = () => {
    setTags(initialTags);
  };

  const [isMarkdown, setIsMarkdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const selectedTags = tags
        .filter((tag) => tag.selected)
        .map((tag) => tag.label)
        .join(","); // Chuyển thành chuỗi với dấu phẩy

      const formdata = new FormData();
      formdata.append("title", title);
      formdata.append("description", description);
      formdata.append("difficulty", difficulty.toString());
      formdata.append("timeLimit", timeLimit.toString());
      formdata.append("memoryLimit", memoryLimit.toString());
      formdata.append("tags", selectedTags);
      formdata.append("file", file as Blob);

      // Prepare API payload

      // Submit the form
      const res = await toast.promise(
        axiosInstance.post("/api/contributions", formdata, {
          headers: { Authorization: "Bearer " + token },
        }),
        {
          pending: "Submitting...",
          success: "Your question has been submitted",
        },
      );

      console.log("Submit contribute response: ", res.data);
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
      console.error(error);
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
      <div className="d-flex flex-row">
        <div className="d-flex container">
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
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
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
                onChange={(e) => setIsMarkdown(e.target.checked)}
              />

              {isMarkdown ? (
                <>
                  <Container className="border rounded mb-3 mt-2">
                    <ReactMarkdown
                      children={description}
                      // remarkPlugins={[remarkMath]}
                      // rehypePlugins={[rehypeKatex]}
                    />
                    {/* {description} */}
                    {/* </ReactMarkdown> */}
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

              <h5 className="mt-3 mb-3">Upload tests</h5>
              <Form.Control
                required
                type="file"
                className="mb-3 w-50"
                onChange={(e) =>
                  setFile((e.target as HTMLInputElement).files?.[0] || null)
                }
              />

              <h5 className="mt-3 mb-3">Time limit (ms)</h5>

              <Form.Control
                required
                type="text"
                placeholder="Time limit"
                onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                className="w-50 mb-2"
              />

              <h5 className="mt-3 mb-3">Memory limit (MB)</h5>

              <Form.Control
                required
                type="text"
                placeholder="Memory limit"
                onChange={(e) => setMemoryLimit(parseInt(e.target.value))}
                className="w-50 mb-2"
              />

              <Container className="d-flex justify-content-center mt-3">
                <Button className="w-25" type="submit">
                  Submit
                </Button>
              </Container>
            </Form>
          </Container>

          <Container
            className="p-3 border-bottom border-end bg-light"
            style={{
              width: "550px",
            }}
          >
            <Container
              className="border border-3 p-3 mt-3"
              style={{
                backgroundColor: "white",
              }}
            >
              <div className="mb-3">
                <img src="/lightbulb.svg" width="36" height="36" />
              </div>
              <ReactMarkdown>{markdown}</ReactMarkdown>
            </Container>
          </Container>
        </div>
      </div>
      <Footer />
    </div>
  );
}
