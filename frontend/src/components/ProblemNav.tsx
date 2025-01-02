import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
const ProblemNav = ({ problemId }: { problemId: string }) => {
  return (
    <Nav variant="underline">
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/problems/${problemId}/description`}
          className="text-dark"
        >
          Description
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/problems/${problemId}/submissions`}
          className="text-dark"
        >
          Submission
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default ProblemNav;
