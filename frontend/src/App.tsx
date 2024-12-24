import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Authentication/Login.tsx";
import Home from "./pages/Home";
import Register from "./pages/Authentication/Register.tsx";
import Profile from "./pages/Profile/Profile.tsx";
import ProblemList from "./pages/Problem/ProblemList.tsx";
import EditProfile from "./pages/Profile/EditProfile.tsx";

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
import SubmissionListUser from "./pages/Profile/SubmissionListUser.tsx";
import NavBar from "./components/NavBar.tsx";
import Footer from "./components/Footer.tsx";
import SubmissionListContribution from "./pages/Contribution/SubmissionListContribution.tsx";

export default function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submissions" element={<SubmissionListUser />} />
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
          <Route
            path="/contributions/:problemId/description"
            element={<Contribution />}
          />
          <Route
            path="/contributions/:problemId/submissions"
            element={<SubmissionListContribution />}
          />
        </Routes>
        <Footer />
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000}
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
    </div>
  );
}
