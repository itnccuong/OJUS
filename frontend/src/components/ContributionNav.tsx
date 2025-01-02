import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";
const ContributionNav = ({ problemId }: { problemId: string }) => {
  return (
    <Nav variant="underline">
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/contributions/${problemId}/description`}
          className="text-dark"
        >
          Description
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/contributions/${problemId}/solution`}
          className="text-dark"
        >
          Solution
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          as={NavLink}
          to={`/contributions/${problemId}/submissions`}
          className="text-dark"
        >
          Submission
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default ContributionNav;
