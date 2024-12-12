import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Authentication/Login.tsx";
import Home from "./pages/Home";
import Register from "./pages/Authentication/Register.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import ProblemList from "./pages/Problem/ProblemList.tsx";
import EditProfile from "./pages/Profile/EditProfile.tsx";
import ShowProfile from "./pages/Profile/ShowProfile.tsx";

import { Slide, ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import ForgotPassword from "./pages/Authentication/ForgotPassword.tsx";
import ForgotPasswordDone from "./pages/Authentication/ForgotPasswordDone.tsx";
import ChangePassword from "./pages/Authentication/ChangePassword.tsx";
import Contribute from "./pages/Contribution/Contribute.tsx";
import ContributionList from "./pages/Contribution/ContributionList.tsx";
import Contribution from "./pages/Contribution/Contribution.tsx";
import Problem from "./pages/Problem/Problem.tsx";
import SubmissionList from "./pages/Problem/SubmissionList.tsx";
import Submission from "./pages/Problem/Submission.tsx";

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
          <Route
            path="/problems/:problemId/description"
            element={<Problem />}
          />
          <Route
            path="/problems/:problemId/submissions"
            element={<SubmissionList />}
          />
          <Route path="/submissions/:submissionId" element={<Submission />} />
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
