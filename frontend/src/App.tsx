import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Profile from "./components/Profile";
import Problem from "./components/Problem";
import EditProfile from "./components/EditProfile";

import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/login" element={<Login />} />
          <Route path="/accounts/register" element={<Register />} />
          <Route path="/u/:username" element={<Profile />} />
          <Route path="/problem" element={<Problem />} />
          <Route path="/profile" element={<EditProfile />} />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
      />
    </>
  );
}
