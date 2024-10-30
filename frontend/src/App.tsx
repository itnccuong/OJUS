import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Problem from "./pages/Problem";
import EditProfile from "./pages/EditProfile";

import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ForgotPassWord from "./pages/ForgotPassword";
import ForgotPasswordDone from "./pages/ForgotPasswordDone";
import ChangePassword from "./pages/ChangePassword";
import Contribute from "./pages/Contribute";
import Contributions from "./pages/Contributions";
import Contribution from "./pages/Contribution";

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
          <Route path="/accounts/password/reset" element={<ForgotPassWord />} />
          <Route
            path="/accounts/password/reset/done"
            element={<ForgotPasswordDone />}
          />
          <Route
            path="/accounts/password/reset/key/:token"
            element={<ChangePassword />}
          />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/contributions" element={<Contributions />} />
          <Route path="/contributions/:id" element={<Contribution />} />
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
