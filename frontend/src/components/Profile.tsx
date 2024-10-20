import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import getURL from "../../utils/getURL";
import { StorageConfig } from "../../interfaces/interface";
import getStorage from "../../utils/getStorage";
import { Button } from "react-bootstrap";
import NavBar from "./NavBar";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [fullname, setFullname] = useState("");

  const storage: StorageConfig | null = getStorage();

  const getProfile = async () => {
    try {
      const { data } = await axios.get(getURL(`/api/user/${username}`));
      setFullname(data.data.user.fullname);
      console.log("getprofile", data);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);
  return (
    <div>
      <NavBar />
      <h3>Fullname: {fullname}</h3>
      {storage && storage.user.username === username && (
        <Button variant="primary" onClick={() => navigate("/profile")}>
          Edit Profile
        </Button>
      )}
    </div>
  );
}
