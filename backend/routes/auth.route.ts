import express from "express";
const router = express.Router();
import { register, login, sendResetLink, changePassword } from "../controllers/auth.controller";

router.post("/register", register);
router.post("/login", login);
router.post("/reset-link", sendResetLink);
router.post("/change-password", changePassword);

export default router;