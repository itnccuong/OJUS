import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import getToken from "../../utils/getToken.ts";
import getURL from "../../utils/getURL";
import storageKeyMap from "../../utils/storageKeyMap.ts";
import { jwtDecode, JwtPayload } from "jwt-decode";

function NavBar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const token = getToken();

  let ID = null;
  if (token) {
    try {
      const decoded = jwtDecode(token) as JwtPayload & { userId: number };  // Cast the type

      // Log all the decoded data to the console
      ID = decoded.userId;
    } catch (error) {
      console.log("Error decoding token:", error);
    }
  }

  const getUser = async () => {
    try {
      const { data } = await axios.get(getURL(`/api/user/${ID}`));
      setUsername(data.data.user.username);
      console.log("getprofile", data);
    } catch (error: any) {
      console.error(error);
    }
  };

  // Initialize navigate
  const handleSignOut = () => {
    localStorage.removeItem(storageKeyMap.token); // Remove token from localStorage
    navigate("/accounts/login"); // Redirect to login
  };

  useEffect(() => {
    getUser();
    console.log("Just console to get rid of warning", token);
  }, []);

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
          {token ? (
            <>
              <Nav>
                {/*Use token to get username, for now this is hardcoded*/}
                <Nav.Link as={NavLink} to={`/u/${username}`}>
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
