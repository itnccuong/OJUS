import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "../../components/NavBar.tsx";
import Footer from "../../components/Footer.tsx";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/getURL.ts";
import {
  RegisterResponseInterface,
  ResponseInterface,
} from "../../../interfaces/response.interface.ts";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("The passwords you entered do not match.");
      return;
    }

    try {
      const res = await toast.promise(
        axiosInstance.post<ResponseInterface<RegisterResponseInterface>>(
          "/api/auth/register",
          {
            username,
            password,
            email,
            fullname,
          },
        ),
        {
          pending: "Sign up...",
          success: "Sign up successfully",
          error: "Sign up failed",
        },
      );
      console.log(res.data);
      navigate("/accounts/login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
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
            label="Username"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              pattern="[^@]+"
              title="The username cannot contain '@'"
              required
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </FloatingLabel>
          <FloatingLabel
            className="mb-3"
            label="Full Name"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              required
              type="text"
              placeholder="Full Name"
              onChange={(e) => setFullName(e.target.value)}
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

          <FloatingLabel
            className="mb-3"
            label="Confirm Password"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              required
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            className="mb-3"
            label="E-mail address"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              required
              type="email"
              placeholder="E-mail address"
              onChange={(e) => setEmail(e.target.value)}
            />
          </FloatingLabel>

          <div className="mb-3">
            <button className="btn btn-primary w-100" type="submit">
              Sign Up
            </button>
          </div>

          <div className="d-flex justify-content-center">
            <p>
              Have an account?{" "}
              <Link
                to="/accounts/login"
                style={{
                  textDecoration: "none",
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </Form>
      </div>
      <Footer />
    </>
  );
}
