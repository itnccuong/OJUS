// import { useNavigate } from "react-router-dom";
import getStorage from "../../utils/getStorage";
import { StorageConfig } from "../../interfaces/interface";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { Accordion, Button, Container } from "react-bootstrap";
import { useState } from "react";
// import { useEffect } from "react";

interface Tag {
  label: string;
  selected: boolean;
}

export default function Contributions() {
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
        i === index ? { ...tag, selected: !tag.selected } : tag
      )
    );
  };

  const handleResetTags = () => {
    setTags(initialTags);
  };
  return (
    <>
      <div className="d-flex flex-column">
        <NavBar />
        <Container
          className="d-flex"
          style={{
            height: "100vh",
          }}
        >
          {/* <div className="d-flex mt-3">
            <Accordion>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Difficulty</Accordion.Header>
                <Accordion.Body>
                  <div className="d-flex flex-column">
                    <Button variant="light" className="w-100 text-success">
                      Easy
                    </Button>
                    <Button variant="light" className="w-100 text-warning">
                      Medium
                    </Button>
                    <Button variant="light" className="w-100 text-danger">
                      Hard
                    </Button>
                  </div>
                </Accordion.Body>
              </Accordion.Item>

              <Accordion.Item eventKey="2">
                <Accordion.Header>Tags</Accordion.Header>
                <Accordion.Body>
                  <div className="mb-3">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`badge rounded-pill m-1 ${
                          tag.selected ? "bg-primary" : "bg-grey text-dark"
                        } mx-1`}
                        onClick={() => toggleTag(index)}
                        style={{ cursor: "pointer" }}
                      >
                        {tag.label}
                      </span>
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

              <Accordion.Item eventKey="1">
                <Accordion.Header>Status</Accordion.Header>
                <Accordion.Body>ok</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div> */}
        </Container>
        <Footer />
      </div>
    </>
  );
}
