import express from "express";
const router = express.Router();
import { submit } from "../controllers/problem.controller";
import { verifyToken } from "../middlewares/verify-token";

router.post("/:problem_id/submit", verifyToken, submit);

export default router;
