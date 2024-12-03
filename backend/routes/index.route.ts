import express from "express";
const router = express.Router();

import userRoute from "./user.route";

router.use("/users", userRoute);

export default router;
