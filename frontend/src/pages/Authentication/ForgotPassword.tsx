import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "../../components/NavBar.tsx";
import Footer from "../../components/Footer.tsx";
import { toast } from "react-toastify";
import axiosInstance from "../../../utils/getURL.ts";
import { AxiosError } from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    try {
      await toast.promise(
        axiosInstance.post("/api/auth/password/reset-link", {
          email: email,
        }),
        {
          pending: "Sending reset link...",
          success: "Reset link sent successfully!",
        },
      );
      navigate("/accounts/password/reset/done");
    } catch (error) {
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "#eceff1",
          height: "87vh",
        }}
      >
        <Form
          className="p-4 rounded-4 w-25 bg-white shadow"
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
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Sending..." : "Reset My Password"}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
