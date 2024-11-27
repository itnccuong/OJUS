import express from "express";
const router = express.Router();
import { submit } from "../controllers/problem.controller";
import { verifyToken } from "../middlewares/verify-token";
import asyncErrorHandler from "../utils/asyncErrorHandler";

router.post("/:problem_id/submit", verifyToken, asyncErrorHandler(submit));

export default router;
