import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getURL from "../../utils/getURL";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "./NavBar";
import Footer from "./Footer";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Login() {
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(getURL("/api/auth/login"), {
        usernameOrEmail,
        password,
      });
      console.log(data);
      // alert("Login successfully!");

      localStorage.setItem("user", JSON.stringify(data.data));
      navigate("/");
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
          {/* <h3 className="text-center mb-3">Sign In</h3>
           */}
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

          <div className="mb-2">
            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <p>
              <Link to="/accounts/password/reset">Forgot Password?</Link>
            </p>
            <p>
              <Link to="/accounts/register">Sign Up</Link>
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
