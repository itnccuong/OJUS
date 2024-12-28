import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { storageKeyMap } from "../utils/constanst.ts";
import useFetch from "../hooks/useFetch.ts";
import { UserWithAvatarInterface } from "../interfaces/interface.ts";
import getToken from "../utils/getToken.ts";

function NavBar() {
  const navigate = useNavigate();

  // Initialize navigate
  const handleSignOut = () => {
    localStorage.removeItem(storageKeyMap.token); // Remove token from localStorage
    navigate("/accounts/login"); // Redirect to login
    location.reload();
  };

  const token = getToken();
  const { data } = useFetch<{
    user: UserWithAvatarInterface;
  }>("/api/user", {
    skip: !token,
    includeToken: true,
  });
  const user = data?.data.user;

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
            {user?.admin && (
              <Nav.Link as={NavLink} to="/contributions">
                Contributions
              </Nav.Link>
            )}
          </Nav>
        </div>

        <div className="d-flex w-100 gap-2 justify-content-end">
          {user ? (
            <>
              <Nav variant="underline">
                <div className="profile-pic align-self-center">
                  <img
                    src={user.avatar ? user.avatar.url : "/user.png"}
                    alt="Profile"
                    className="profile-img rounded-circle border shadow-sm"
                    width={32}
                    height={32}
                    onClick={() => {
                      navigate(`/u/${user.username}`);
                    }}
                    style={{
                      cursor: "pointer",
                      objectFit: "cover",
                      transition: "opacity 0.3s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.5")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  />
                </div>
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
