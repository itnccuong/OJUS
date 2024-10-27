import { FormEvent, useState } from "react";
import axios from "axios";
import getURL from "../../utils/getURL";
import { Link, useNavigate } from "react-router-dom";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

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
      const { data } = await axios.post(getURL("/api/auth/register"), {
        username,
        password,
        email,
        fullname,
      });
      console.log(data);
      toast.success("Registered successfully!");
      navigate("/accounts/login");
    } catch (error: any) {
      toast.error(error.response.data.message);
      console.error(error);
    }
  };
  return (
    <>
      <NavBar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "#eceff1",
          height: "86vh",
        }}
      >
        <Form
          className="p-4 rounded w-25 bg-white shadow"
          onSubmit={handleSubmit}
        >
          <Container className="d-flex justify-content-center align-items-center mb-4">
            <img
              src="https://assets.leetcode.com/static_assets/public/webpack_bundles/images/logo.c36eaf5e6.svg"
              width="80"
              height="80"
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
      <Container>
        <Footer />
      </Container>
    </>
  );
}
