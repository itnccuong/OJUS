// import { useNavigate } from "react-router-dom";
import getStorage from "../../utils/getStorage";
import { StorageConfig } from "../../interfaces/interface";
import NavBar from "./NavBar";
// import { useEffect } from "react";

export default function Home() {
  // const navigate = useNavigate(); // Initialize navigate

  const storage: StorageConfig | null = getStorage(); // Get token from localStorage

  // useEffect(() => {
  //   if (!storage) {
  //     navigate("/accounts/login");
  //   }
  // }, [storage, navigate]);

  if (storage) {
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
