import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "../../components/NavBar.tsx";
import Footer from "../../components/Footer.tsx";
import { toast } from "react-toastify";
import storageKeyMap from "../../../utils/storageKeyMap.ts";
import axiosInstance from "../../../utils/getURL.ts";
import {
  LoginResponseInterface,
  ResponseInterface,
} from "../../../interfaces/response.interface.ts";

export default function Login() {
  const navigate = useNavigate();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await toast.promise(
        axiosInstance.post<ResponseInterface<LoginResponseInterface>>(
          "/api/auth/login",
          {
            usernameOrEmail,
            password,
          },
        ),
        {
          pending: "Sign in...",
          success: "Sign in successfully",
          error: "Sign in failed",
        },
      );
      console.log(res.data);
      localStorage.setItem(storageKeyMap.token, res.data.data.token);
      navigate("/");
    } catch (error) {
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
              src="/ojus.png"
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
