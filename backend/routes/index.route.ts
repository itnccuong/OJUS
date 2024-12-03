import express from "express";
const router = express.Router();

import userRoute from "./user.route";

router.use("/users", userRoute);
// router.use("/contributes", contributeRoute);

export default router;
