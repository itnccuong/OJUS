import express from "express";
const router = express.Router();
import { getAllProblems, submit } from "../controllers/problem.controller";
import { verifyToken } from "../middlewares/verify-token";
import asyncErrorHandler from "../utils/asyncErrorHandler";

router.get("/", asyncErrorHandler(getAllProblems));
router.post("/:problem_id/", verifyToken, asyncErrorHandler(submit));

export default router;
