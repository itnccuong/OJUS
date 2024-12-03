import express from "express";
const router = express.Router();

// import authRoute from "./auth.route";
import userRoute from "./user.route";
import contributeRoute from "./contribute.route";

// router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/contributes", contributeRoute);

export default router;
