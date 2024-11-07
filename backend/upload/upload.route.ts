import express from "express";
const upload = express.Router();
import { startUpload, completeUpload } from "./upload.controller";


upload.post("/start-upload", startUpload);
upload.post("/complete-upload", completeUpload);

export default upload;
