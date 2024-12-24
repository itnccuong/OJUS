import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import getToken from "../../utils/getToken.ts";
import axiosInstance from "../../utils/axiosInstance.ts";
import { storageKeyMap } from "../../utils/constanst.ts";

function NavBar() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const token = getToken();

  // Initialize navigate
  const handleSignOut = () => {
    localStorage.removeItem(storageKeyMap.token); // Remove token from localStorage
    navigate("/accounts/login"); // Redirect to login
    location.reload();
  };
  useEffect(() => {
    if (token) {
      getUserProfile(); // Retrieve profile using userId from the token
    }
  }, [token]);

  const getUserProfile = async () => {
    try {
      const response = await axiosInstance.get("/api/user", {
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
    <Navbar className="border-bottom shadow-sm d-flex px-4">
      <div className="container-xxl">
        <div className="d-flex gap-3 justify-content-start">
          <Navbar.Brand as={NavLink} to={"/"}>
            <img
              src="/ojus.png"
              width="48"
              height="32"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>

          <Nav variant="underline">
            <Nav.Link as={NavLink} to={"/problems"}>
              Problems
            </Nav.Link>
            <Nav.Link as={NavLink} to={"/submissions"}>
              Submissions
            </Nav.Link>
            <Nav.Link as={NavLink} to={"/contribute"}>
              Contribute
            </Nav.Link>
            <Nav.Link as={NavLink} to={"/contributions"}>
              Contributions
            </Nav.Link>
          </Nav>
        </div>

        <div className="d-flex w-100 gap-2 justify-content-end">
          {username ? (
            <>
              <Nav variant="underline">
                <Nav.Link as={NavLink} to={`/u/${username}`}>
                  Profile
                </Nav.Link>
                <Nav.Link onClick={handleSignOut}>Sign Out</Nav.Link>
              </Nav>
            </>
          ) : (
            <>
              <Nav variant="underline">
                <Nav.Link as={NavLink} to="/accounts/register">
                  Register
                </Nav.Link>
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
