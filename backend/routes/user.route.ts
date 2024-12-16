import express from "express";
const router = express.Router();
import { 
  getProfileByName, 
  getUserByID,
  updateProfile 
} from "../controllers/user.controller";
import { verifyToken } from "../middlewares/verify-token";

router.get("/", verifyToken, getUserByID);
router.patch("/", verifyToken, updateProfile);

router.get("/:username", getProfileByName);

export default router;