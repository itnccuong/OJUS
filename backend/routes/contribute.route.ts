import express from "express";
const router = express.Router();
const { verifyToken } = require("../middlewares/verify-token");
// const { uploadFile } = require('../upload/upload-file');
import multer from "multer";
const upload = multer({ dest: "uploads/", storage: multer.memoryStorage() }); // Specify the destination for uploaded files

import {
  searchContribute,
  getOneContribute,
  getAllContribute,
  rejectContribute,
  acceptContribute,
} from "../controllers/contribute.controller";
import asyncErrorHandler from "../utils/asyncErrorHandler";

router.use(verifyToken);

// router.get("/search", searchContribute);
router.get("/", asyncErrorHandler(getAllContribute));
router.get("/:contribute_id", asyncErrorHandler(getOneContribute));
// router.post("/", upload.single("file"), asyncErrorHandler(submitContribute));
router.post("/accept/:contribute_id", asyncErrorHandler(acceptContribute));
router.post("/reject/:contribute_id", asyncErrorHandler(rejectContribute));

export default router;
