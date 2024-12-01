import express from "express";
const router = express.Router();
import {
  getAllProblemsNoAccount,
  getAllProblemsWithAccount,
  getOneProblemNoAccount,
  getOneProblemWithAccount,
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

router.get(
  "/:problem_id/no-account",
  asyncErrorHandler(getOneProblemNoAccount),
);
router.get(
  "/:problem_id/with-account",
  verifyToken,
  asyncErrorHandler(getOneProblemWithAccount),
);

export default router;
