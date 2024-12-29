import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FloatingLabel, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { storageKeyMap } from "../../utils/constanst.ts";
import CustomSpinner from "../../components/CustomSpinner.tsx";
import useSubmit from "../../hooks/useSubmit.ts";
import { AxiosError } from "axios";

export default function Login() {
  const navigate = useNavigate();

  const { submit, isSubmitting } = useSubmit();

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await submit<{ token: string }>("POST", "/api/auth/login", {
        usernameOrEmail,
        password,
      });

      localStorage.setItem(storageKeyMap.token, res.token);
      toast.success("Logged in successfully");
      navigate("/problems");
    } catch (err) {
      if (err instanceof AxiosError) {
        toast.error(err.response?.data?.message);
      }
      console.error(err);
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
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-100"
            >
              {isSubmitting ? <CustomSpinner /> : "Sign In"}
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
    </div>
  );
}
