// import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import getToken from "../../utils/getToken.ts";
// import { useEffect } from "react";

export default function Home() {
  // const navigate = useNavigate(); // Initialize navigate

  const token = getToken(); // Get token from localStorage

  // useEffect(() => {
  //   if (!storage) {
  //     navigate("/accounts/login");
  //   }
  // }, [storage, navigate]);

  if (token) {
    return (
      <>
        <NavBar />
        <h1>Home 2</h1>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <h1>Home 1</h1>
    </>
  );
}
