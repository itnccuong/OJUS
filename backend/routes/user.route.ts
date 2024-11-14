import express from "express";
const router = express.Router();
import { getProfileByName } from "../controllers/user.controller";

router.get("/:username", getProfileByName);

export default router;
