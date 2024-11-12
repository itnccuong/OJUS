import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProblemList from "./pages/ProblemList.tsx";
import EditProfile from "./pages/EditProfile";
import ShowProfile from "./pages/ShowProfile";

import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordDone from "./pages/ForgotPasswordDone";
import ChangePassword from "./pages/ChangePassword";
import Contribute from "./pages/Contribute";
import ContributionList from "./pages/ContributionList.tsx";
import Contribution from "./pages/Contribution";
import Problem from "./pages/Problem";
import Submission from "./pages/Submission";

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/accounts/login" element={<Login />} />
          <Route path="/accounts/register" element={<Register />} />
          <Route path="/u/:username" element={<Profile />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problems/:id/:page" element={<Problem />} />
          <Route path="/profile" element={<EditProfile />} />
          <Route path="/accounts/password/reset" element={<ForgotPassword />} />
          <Route path="/showprofile" element={<ShowProfile />} />

          <Route
            path="/accounts/password/reset/done"
            element={<ForgotPasswordDone />}
          />
          <Route
            path="/accounts/password/reset/key/:token"
            element={<ChangePassword />}
          />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/contributions" element={<ContributionList />} />
          <Route path="/contributions/:id/:page" element={<Contribution />} />
          <Route path="/submissions" element={<Submission />} />
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
