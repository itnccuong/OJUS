import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FloatingLabel, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import useSubmit from "../../hooks/useSubmit.ts";
import CustomSpinner from "../../components/CustomSpinner.tsx";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [fullnameError, setFullnameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const { submit, isSubmitting } = useSubmit();

  // Password validation
  const validatePassword = (pass: string): boolean => {
    const allowedSpecialChars = /^[A-Za-z0-9#@!*]+$/; // Only allows #, !, @, * as special characters
 
    if (pass.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    if (pass.length > 50) {
      setPasswordError("Password cannot exceed 50 characters");
      return false;
    }
    if (!allowedSpecialChars.test(pass)) {
      setPasswordError("Password can only contain letters, numbers, and common special characters (!@#$%^&*()_+-=[]{};':\"\\|,.<>/?)");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // Username validation
  const validateUsername = (user: string): boolean => {
    const usernameRegex = /^[A-Za-z0-9._-]+$/;
    
    if (user.includes(" ")) {
      setUsernameError("Username cannot contain spaces");
      return false;
    }
    if (!usernameRegex.test(user)) {
      setUsernameError("Username can only contain letters, numbers, dots, underscores, and hyphens");
      return false;
    }
    if (user.length < 3 || user.length > 30) {
      setUsernameError("Username must be between 3 and 30 characters");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const validateFullname = (full: string): boolean => {
    if (full.length < 1 || full.length > 50) {
      setFullnameError("Username must be between 1 and 50 characters");
      return false;
    }
    setFullnameError("");
    return true;
  };

  const validateEmail = (email : string) : boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Stricter email validation regex

    if (!emailRegex.test(email)) {
      setEmailError("Invalid email address.");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate inputs before submission
    if (!validateUsername(username) || !validatePassword(password)) {
      return;
    }

    if (password !== confirmPassword) {
      toast.error("The passwords you entered do not match.");
      return;
    }

    try {
      const res = await submit("POST", "/api/auth/register", {
        username,
        password,
        email,
        fullname,
      });
      console.log(res);
      toast.success("Sign up successfully");
      navigate("/accounts/login");
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
            <img src="/ojus.png" width="72" height="48" alt="logo" />
          </div>

          <FloatingLabel
            className="mb-3"
            label="Username"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              required
              type="text"
              placeholder="Username"
              maxLength={30}
              onChange={(e) => {
                setUsername(e.target.value);
                validateUsername(e.target.value);
              }}
              isInvalid={!!usernameError}
            />
            <Form.Control.Feedback type="invalid">
              {usernameError}
            </Form.Control.Feedback>
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
              maxLength={50}
              onChange={(e) => {
                setFullName(e.target.value);
                validateFullname(e.target.value);
              }}
              isInvalid={!!fullnameError}
            />
            <Form.Control.Feedback type="invalid">
              {fullnameError}
            </Form.Control.Feedback>
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
              onChange={(e) => {
                setPassword(e.target.value);
                validatePassword(e.target.value);
              }}
              isInvalid={!!passwordError}
            />
            <Form.Control.Feedback type="invalid">
              {passwordError}
            </Form.Control.Feedback>
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
              onChange={(e) => {
                setEmail(e.target.value)
                validateEmail(e.target.value);
              }}
              isInvalid={!!emailError}
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </FloatingLabel>

          <div className="mb-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-100"
            >
              {isSubmitting ? <CustomSpinner /> : "Sign Up"}
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