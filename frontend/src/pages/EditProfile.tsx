import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useEffect } from "react";
import getToken from "../../utils/getToken.ts";

export default function EditProfile() {
  const navigate = useNavigate(); // Initialize navigate

  const token = getToken(); // Get token from localStorage

  useEffect(() => {
    if (!token) {
      navigate("/accounts/login");
    }
  }, [token, navigate]);

  return (
    <div>
      <NavBar />
      <h1>Edit Profile</h1>
    </div>
  );
}
