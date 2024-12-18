import express from "express";
const router = express.Router();
import { updateProfile } from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verify-token";

router.patch("/", verifyToken, updateProfile);

export default router;
