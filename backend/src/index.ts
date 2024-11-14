import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();
import path from "path";
import fs from "fs";

const app = express();

// router
import router from "../routes/index.route";
import upload from "../upload/upload.route";

import { initAllDockerContainers } from "../services/docker/docker-executor";

initAllDockerContainers();

// middlewares
app.use(express.json());
app.use(
  cors({
    // origin: ["http://localhost:5173"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// make upload dir
const uploadDir = path.join(__dirname, "../public/upload");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// routes
app.use("/api", router);

// temorary route for upload
app.get("/upload", (req, res) => {
  res.sendFile(path.join(__dirname, "../upload/test.html"));
});

app.use("/upload", upload);

// server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
