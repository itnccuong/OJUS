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

//docker
import { createContainer, killContainer, compile, execute } from "./docker";

const dateTimeNowFormated = () => {
  return new Date().toLocaleString(undefined, { timeZone: "Asia/Kolkata" });
};

const imageIndex = { GCC: 0, PY: 1, JS: 2, JAVA: 3 };
const imageNames = [
  "gcc:latest",
  "python:3.10-slim",
  "node:16.17.0-bullseye-slim",
  "openjdk:20-slim",
];
const containerNames = [
  "gcc-oj-container",
  "py-oj-container",
  "js-oj-container",
  "java-oj-container",
];
/** @type {string[]} */
const containerIds: string[] = [];
const initDockerContainer = (image: string, index: number) => {
  const name = containerNames[index];
  return new Promise(async (resolve, reject) => {
    try {
      // check and kill already running container
      await killContainer(name);
      // now create new container of image
      const data = await createContainer({ name, image });
      containerIds[index] = data;
      resolve(`${name} Id : ${data}`);
    } catch (error) {
      reject(`${name} Docker Error : ${JSON.stringify(error)}`);
    }
  });
};
const initAllDockerContainers = async () => {
  try {
    const res = await Promise.all(
      imageNames.map((image, index) => initDockerContainer(image, index)),
    );
    console.log(res.join("\n"));
    console.log("\nAll Containers Initialized");
  } catch (error) {
    console.error("Docker Error:", error);
    console.error(dateTimeNowFormated());
  }
};

const Execute = async () => {
  await initAllDockerContainers();
  const containerId = containerIds[0];
  const filename = "main.cpp";
  const input = "Hello";
  const language = "cpp";

  const Compile = await compile(containerId, filename, language);

  console.log("Compile: ", Compile);

  const output = await execute(
    containerId,
    "main",
    input,
    language,
    (data, type, pid) => {
      console.log(`[${pid}] ${type}: ${data}`);
    },
  );

  console.log("Output: ", output);
  // const containerId = containerIds[1];
  // const filename = "main.py";
  // const input = "";
  // const language = "py";
  //
  // const output = await execute(
  //   containerId,
  //   filename,
  //   input,
  //   language,
  //   (data, type, pid) => {
  //     console.log(`[${pid}] ${type}: ${data}`);
  //   },
  // );
  //
  // console.log(output);
};

Execute();

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
