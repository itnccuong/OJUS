import express from "express";
const router = express.Router();

import authRoute from "./auth.route";
import userRoute from "./user.route";
import contributeRoute from "./contribute.route";
import problemRoute from "./problem.route";

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/contributes", contributeRoute);
router.use("/problems", problemRoute);

router.post("/register", (req, res, next) => {
  if (!req.body.firstName) {
    res.status(400).json("you need to pass a firstName");
    return;
  }
  res.sendStatus(201);
});

export default router;
