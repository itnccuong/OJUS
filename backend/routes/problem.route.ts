import express from "express";
const router = express.Router();
import {
  getAllProblemsNoAccount,
  getAllProblemsWithAccount,
  submit,
} from "../controllers/problem.controller";
import { verifyToken } from "../middlewares/verify-token";
import asyncErrorHandler from "../utils/asyncErrorHandler";

router.get("/no-account", asyncErrorHandler(getAllProblemsNoAccount));
router.get(
  "/with-account",
  verifyToken,
  asyncErrorHandler(getAllProblemsWithAccount),
);
router.post("/:problem_id/", verifyToken, asyncErrorHandler(submit));

export default router;
