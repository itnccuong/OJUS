import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { StorageConfig } from "../../interfaces/interface";
import getStorage from "../../utils/getStorage";

function NavBar() {
  const navigate = useNavigate();
  const storage: StorageConfig | null = getStorage(); // Get token from localStorage
  // Initialize navigate
  const handleSignOut = () => {
    localStorage.removeItem("user"); // Remove token from localStorage
    navigate("/accounts/login"); // Redirect to login
  };
  return (
    <Navbar expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand as={NavLink} to={"/"}>
          <img
            src="/leetcode.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>

        <Nav className="me-auto">
          <Nav.Link as={NavLink} to={"/problem"}>
            Problems
          </Nav.Link>
        </Nav>

        {storage ? (
          <>
            <Nav>
              <Nav.Link as={NavLink} to={`/u/${storage.user.username}`}>
                Profile
              </Nav.Link>
            </Nav>

            <Nav>|</Nav>

            <Nav className="d-flex justify-content-end">
              <Nav.Link href="#" onClick={handleSignOut}>
                Sign Out
              </Nav.Link>
            </Nav>
          </>
        ) : (
          <>
            <Nav>
              <Nav.Link as={NavLink} to="/accounts/register">
                Register
              </Nav.Link>
            </Nav>

            <Nav>|</Nav>

            <Nav>
              <Nav.Link as={NavLink} to="/accounts/login">
                Sign In
              </Nav.Link>
            </Nav>
          </>
        )}
      </Container>
    </Navbar>
  );
}

export default NavBar;
