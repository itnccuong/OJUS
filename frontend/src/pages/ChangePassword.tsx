import axios from "axios";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getURL from "../../utils/getURL";
import { Container, FloatingLabel, Form } from "react-bootstrap";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function ChangePassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new password and confirm password
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      // Make a request to change the password
      const { data } = await axios.post(getURL("/api/auth/change-password"), {
        newPassword: newPassword,
        token: token,
      });
      console.log("Change pass", data);
      toast.success("Password changed successfully!");

      // Optionally redirect to another page (like login or profile)
      navigate("/accounts/login");
    } catch (error: any) {
      console.error("Error changing password:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <NavBar />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          backgroundColor: "#eceff1",
          height: "87vh",
        }}
      >
        <Form
          className="p-4 rounded w-25 bg-white shadow"
          onSubmit={handleSubmit}
        >
          {/* <h3 className="text-center mb-3">Sign In</h3>
           */}
          <Container className="d-flex justify-content-center align-items-center mb-4 border-bottom">
            <h3 className="mb-3">Change Password</h3>
          </Container>
          <FloatingLabel
            className="mb-3"
            label="New Password"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              required
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </FloatingLabel>

          <FloatingLabel
            className="mb-3"
            label="Confirm New Password"
            style={{
              color: "#666666",
            }}
          >
            <Form.Control
              required
              type="password"
              placeholder="Confirm New Password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </FloatingLabel>

          <div className="mb-2">
            <button type="submit" className="btn btn-primary w-100">
              Change Password
            </button>
          </div>
        </Form>
      </div>
      <Footer />
    </>
  );
}
