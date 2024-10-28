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
    <Navbar expand="lg" className="bg-body-tertiary border-bottom d-flex">
      <Container className="d-flex">
        <Navbar.Brand as={NavLink} to={"/"}>
          <img
            src="/leetcode.svg"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="React Bootstrap logo"
          />
        </Navbar.Brand>

        <Nav>
          <Nav.Link as={NavLink} to={"/problem"} className="mx-2">
            Problems
          </Nav.Link>
        </Nav>

        <Nav>
          <Nav.Link as={NavLink} to={"/contribute"} className="mx-2">
            Contribute
          </Nav.Link>
        </Nav>

        <Nav>
          <Nav.Link as={NavLink} to={"/contributions"} className="mx-2">
            Contributions
          </Nav.Link>
        </Nav>

        <Container className="d-flex justify-content-end">
          {storage ? (
            <>
              <Nav>
                <Nav.Link as={NavLink} to={`/u/${storage.user.username}`} className="mx-2">
                  Profile
                </Nav.Link>
              </Nav>

              <Nav>
                <Nav.Link href="#" onClick={handleSignOut}>
                  Sign Out
                </Nav.Link>
              </Nav>
            </>
          ) : (
            <>
              <Nav>
                <Nav.Link as={NavLink} to="/accounts/register" className="mx-2">
                  Register
                </Nav.Link>
              </Nav>

              <Nav>
                <Nav.Link as={NavLink} to="/accounts/login">
                  Sign In
                </Nav.Link>
              </Nav>
            </>
          )}
        </Container>
      </Container>
    </Navbar>
  );
}

export default NavBar;
