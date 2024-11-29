import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import getToken from "../../utils/getToken.ts";
import getURL from "../../utils/getURL";
import storageKeyMap from "../../utils/storageKeyMap.ts";

function NavBar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const token = getToken();

  // Initialize navigate
  const handleSignOut = () => {
    localStorage.removeItem(storageKeyMap.token); // Remove token from localStorage
    navigate("/accounts/login"); // Redirect to login
  };
  useEffect(() => {
    if (token) {
      getUserProfile(); // Retrieve profile using userId from the token
    }
  }, [token]);

  const getUserProfile = async () => {
    try {
      const response = await axios.get(getURL("/api/user"), {
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });
      console.log("res get profile", response);
      setUsername(response.data.data.user.username); // Assuming response structure has data -> user -> username
      console.log("User Profile:", response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
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
