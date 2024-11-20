import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import getURL from "../../utils/getURL";
import { Button } from "react-bootstrap";
import NavBar from "../components/NavBar";
import getToken from "../../utils/getToken.ts";

export default function Profile() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [fullname, setFullname] = useState("");

  const token = getToken();

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
    console.log("Just console to get rid of warning", token);
  }, []);
  return (
    <div>
      <NavBar />
      <h3>Fullname: {fullname}</h3>
      {/*For now, the edit button always shows.
      In the future, we will only show this button if the user is the owner of the profile.
      To do that, use token to request username from server,
      then check if that username is equal to the username in the URL.
      ===> Duy lam phan nay
      */}
      {true && (
        <Button variant="primary" onClick={() => navigate("/profile")}>
          Edit Profile
        </Button>
      )}
    </div>
  );
}
