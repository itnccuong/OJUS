import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FloatingLabel, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance.ts";
import { AxiosError } from "axios";

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
        axiosInstance.post("/api/auth/register", {
          username,
          password,
          email,
          fullname,
        }),
        {
          pending: "Sign up...",
          success: "Sign up successfully",
        },
      );
      console.log(res.data);
      navigate("/accounts/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
      console.error(error);
    }
  };
  return (
    <div className="d-flex flex-grow-1 bg-body-tertiary">
      <div className="container-xxl d-flex justify-content-center align-items-center">
        <Form
          className="p-4 border border-dark-subtle rounded-4 w-25 bg-white shadow my-5"
          onSubmit={handleSubmit}
        >
          <div className="d-flex justify-content-center align-items-center mb-4">
            <img src="/ojus.png" width="72" height="48" />
          </div>

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
    </div>
  );
}
