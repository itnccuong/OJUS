import express from "express";
const router = express.Router();
import { getProfileByName } from "../controllers/user.controller";
import AsyncErrorHandler from "../utils/asyncErrorHandler";

router.get("/:username", AsyncErrorHandler(getProfileByName));

export default router;
