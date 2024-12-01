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
          <Navbar.Brand as={NavLink} to={"/"}>
            <img
              src="https://s3-alpha-sig.figma.com/img/0c6a/519e/9a3231eb4b597654b04a494e83e43344?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ppbyGHEzIau5UmICgG1z8tieMEPfuY1HBlwb3JXbx9As3Ze5OqBFi7tOicPQPE-A2OPvgvLoKf65voJVcz5uFThKWM6Huj~uPjMOnOpLLum0cXE5GZonItkyGvP72RhM92Gcy0aDuWdxhN3gYmdQAvy01PNJj-ojljO6MAq4CYK2dPzOxc3faajtZUFHj7iL3tsIjZOfW9NqbWCDYYLC7p6jrOdQwuwTe~RDqrRw6zzTwtiAFu8KBI1ElQAnRGEnU7RoejcO8fHKW3YnFjGodxXA3vhHSieDNYog81LvHoS4PfUhiPqeY1SdRpS2TrIbFqvEPfrlSNddqijr66sG5A__"
              width="48"
              height="32"
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
