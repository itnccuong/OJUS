import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import getToken from "../../utils/getToken.ts";
import storageKeyMap from "../../utils/storageKeyMap.ts";

function NavBar() {
  const navigate = useNavigate();
  const token = getToken(); // Get token from localStorage
  // Initialize navigate
  const handleSignOut = () => {
    localStorage.removeItem(storageKeyMap.token); // Remove token from localStorage
    navigate("/accounts/login"); // Redirect to login
  };
  return (
    <Navbar className="bg-body-tertiary border-bottom d-flex">
      <div className="d-flex container">
        <div className="container d-flex gap-3 justify-content-start">
          <Navbar.Brand as={NavLink} to={token ? "/" : "/accounts/login"}>
            <img
              src="/ojus.png"
              width="48"
              height="32"
              className="d-inline-block align-top"
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
          {token ? (
            <>
              <Nav>
                {/*Use token to get username, for now this is hardcoded*/}
                <Nav.Link as={NavLink} to={`/u/duygay`}>
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

              <Nav>
                <Nav.Link as={NavLink} to="/showProfile">
                  Profile
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
