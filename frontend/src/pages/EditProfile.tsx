import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { StorageConfig } from "../../interfaces/interface";
import getStorage from "../../utils/getStorage";
import { useEffect } from "react";

export default function EditProfile() {
  const navigate = useNavigate(); // Initialize navigate

  const storage: StorageConfig | null = getStorage(); // Get token from localStorage

  useEffect(() => {
    if (!storage) {
      navigate("/accounts/login");
    }
  }, [storage, navigate])

  return (
    <div>
      <NavBar />
      <h1>Edit Profile</h1>
    </div>
  );
}
