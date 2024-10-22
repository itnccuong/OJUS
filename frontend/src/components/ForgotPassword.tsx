import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import getURL from "../../utils/getURL";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { toast } from "react-toastify";

export default function ForgotPassWord() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
    //   const res = await axios.post(getURL("/api/auth/reset-link"), {
    //     email: email,
    //   });
      toast.promise(
        axios.post(getURL("/api/auth/reset-link"), {
            email: email,
          }),
        {
          pending: "Sending reset link...",
          success: "Reset link sent successfully!",
          error: "Failed to send reset link",
        },
        // {
        //   style: {
        //     minWidth: "250px",
        //   },
        // }
      ).then(() => {
          navigate("/accounts/password/reset/done");
      })

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
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
          <Container className="d-flex justify-content-center align-items-center mb-4 border-bottom">
            <h3 className="mb-3">Password Reset</h3>
          </Container>
          <Container
            className="p-2 mb-4 border border-warning"
            style={{
              background: "#ffffe0",
            }}
          >
            <p className="mt-1">
              Forgotten your password? Enter your e-mail address below, and
              we'll send you an e-mail allowing you to reset it.
            </p>
          </Container>
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

          <div className="mb-2">
            <button type="submit" className="btn btn-primary w-100">
              Reset My Password
            </button>
          </div>
        </Form>
      </div>
      <Container>
        <Footer />
      </Container>
    </>
  );
}
