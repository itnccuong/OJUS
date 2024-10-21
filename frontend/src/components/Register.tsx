import { FormEvent, useState } from "react";
import axios from "axios";
import getURL from "../../utils/getURL";
import { Link, useNavigate } from "react-router-dom";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "./NavBar";
import Footer from "./Footer";

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
      alert("Passwords do not match!");
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
      alert("Registered successfully!");
      navigate("/accounts/login");
    } catch (error: any) {
      alert(error.response.data.message);
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
          <h3 className="text-center mb-3">Sign Up</h3>

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
              Have an account? <Link to="/accounts/login">Sign In</Link>
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
