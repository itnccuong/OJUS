import express from "express";
const router = express.Router();
import {
  register,
  // login,
  sendResetLink,
  changePassword,
} from "../controllers/auth.controller";
import asyncErrorHandler from "../utils/asyncErrorHandler";

router.post("/register", asyncErrorHandler(register));
// router.post("/login", asyncErrorHandler(login));
router.post("/reset-link", asyncErrorHandler(sendResetLink));
router.post("/change-password", asyncErrorHandler(changePassword));

export default router;
