import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import storageKeyMap from "../../utils/storageKeyMap.ts";
import axiosInstance from "../../utils/getURL";
import {
  LoginResponseInterface,
  ResponseInterface,
} from "../../interfaces/response.interface.ts";

export default function Login() {
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axiosInstance.post<
        ResponseInterface<LoginResponseInterface>
      >("/api/auth/login", {
        usernameOrEmail,
        password,
      });
      console.log(data);
      toast.success("Logged in successfully");
      localStorage.setItem(storageKeyMap.token, data.data.token);
      navigate("/");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };

  return (
    <div>
      <NavBar />
      <div
        className="d-flex justify-content-center align-items-center bg-grey"
        style={{
          // backgroundColor: "#eceff1",
          height: "87vh",
        }}
      >
        <Form
          className="p-4 rounded w-25 bg-white shadow"
          onSubmit={handleSubmit}
        >
          {/* <h3 className="text-center mb-3">Sign In</h3>
           */}
          <Container className="d-flex justify-content-center align-items-center mb-4">
            <img
              src="https://s3-alpha-sig.figma.com/img/0c6a/519e/9a3231eb4b597654b04a494e83e43344?Expires=1733702400&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ppbyGHEzIau5UmICgG1z8tieMEPfuY1HBlwb3JXbx9As3Ze5OqBFi7tOicPQPE-A2OPvgvLoKf65voJVcz5uFThKWM6Huj~uPjMOnOpLLum0cXE5GZonItkyGvP72RhM92Gcy0aDuWdxhN3gYmdQAvy01PNJj-ojljO6MAq4CYK2dPzOxc3faajtZUFHj7iL3tsIjZOfW9NqbWCDYYLC7p6jrOdQwuwTe~RDqrRw6zzTwtiAFu8KBI1ElQAnRGEnU7RoejcO8fHKW3YnFjGodxXA3vhHSieDNYog81LvHoS4PfUhiPqeY1SdRpS2TrIbFqvEPfrlSNddqijr66sG5A__"
              width="72"
              height="48"
              // className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Container>
          <FloatingLabel
            className="mb-3"
            label="Username or E-mail"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              required
              type="text"
              placeholder="Username or E-mail"
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            className="mb-3"
            label="Password"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              required
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </FloatingLabel>

          <div className="mb-3">
            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <p>
              <Link
                to="/accounts/password/reset"
                style={{
                  textDecoration: "none",
                }}
              >
                Forgot Password?
              </Link>
            </p>
            <p>
              <Link
                to="/accounts/register"
                style={{
                  textDecoration: "none",
                }}
              >
                Sign Up
              </Link>
            </p>
          </div>
        </Form>
      </div>
      <Footer />
    </div>
  );
}
