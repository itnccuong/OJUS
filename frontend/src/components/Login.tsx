import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getURL from "../../utils/getURL";
import { Form } from "react-bootstrap";

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
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Form
        className="p-4 border border-secondary rounded w-25"
        onSubmit={handleSubmit}
      >
        <h3 className="text-center mb-3">Sign In</h3>
        <div className="mb-3">
          <Form.Control
            required
            type="text"
            placeholder="Username or E-mail"
            onChange={(e) => setUsernameOrEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <Form.Control
            required
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

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
  );
}
