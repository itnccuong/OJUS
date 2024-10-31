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
    <Navbar className="bg-body-tertiary border-bottom d-flex">
      <div className="d-flex container">
        <div className="container d-flex gap-3 justify-content-start">
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
            <Nav.Link as={NavLink} to={"/problems"}>
              Problems
            </Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link as={NavLink} to={"/contribute"}>
              Contribute
            </Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link as={NavLink} to={"/contributions"}>
              Contributions
            </Nav.Link>
          </Nav>
        </div>

        <div className="d-flex container gap-2 justify-content-end">
          {storage ? (
            <>
              <Nav>
                <Nav.Link as={NavLink} to={`/u/${storage.user.username}`}>
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
                <Nav.Link as={NavLink} to="/accounts/register">
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
        </div>
      </div>
    </Navbar>
  );
}

export default NavBar;
