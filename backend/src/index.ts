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

const containerIds: string[] = [];
const initDockerContainer = async (image: string, index: number) => {
  const name = containerNames[index];
  try {
    // check and kill already running container
    await killContainer(name);
    // now create a new container of image
    const data = await createContainer({ name, image });
    containerIds[index] = data;
    return `${name} Id : ${data}`;
  } catch (error) {
    throw new Error(`${name} Docker Error : ${JSON.stringify(error)}`);
  }
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

//Exec against testcases
const codeDirectory = path.join(__dirname, "codeFiles");
const languageErrMsg = `Please select a language / valid language.
Or may be this language is not yet supported !`;
const stderrMsgFn = ({
  index,
  input,
  output,
  exOut,
}: {
  index: number;
  input: string;
  output: string;
  exOut: string;
}) => `Testcase ${index + 1} Failed
Expected Output: 
${output} 
Your Output: 
${exOut}`;

type InputFunc = (id: string) => string;

interface Detail {
  compiledExtension: string;
  containerId: () => string;
  inputFunction: InputFunc | null;
}

const languageSpecificDetails: Record<string, Detail> = {
  c: {
    compiledExtension: "out",
    inputFunction: null,
    containerId: () => containerIds[imageIndex.GCC],
  },
  cpp: {
    compiledExtension: "out",
    inputFunction: null,
    containerId: () => containerIds[imageIndex.GCC],
  },
  py: {
    compiledExtension: "",
    inputFunction: (data: string) => (data ? data.split(" ").join("\n") : ""),
    containerId: () => containerIds[imageIndex.PY],
  },
  js: {
    compiledExtension: "",
    inputFunction: null,
    containerId: () => containerIds[imageIndex.JS],
  },
  java: {
    compiledExtension: "class",
    inputFunction: null,
    containerId: () => containerIds[imageIndex.JAVA],
  },
};
// ####################################################################################
// ####################################################################################

const execCodeAgainstTestcases = async (
  filePath: string,
  language: string,
  testcase: string,
) => {
  // Check if language is supported or not
  if (!languageSpecificDetails[language]) {
    throw new Error(languageErrMsg);
  }

  let containerId = languageSpecificDetails[language].containerId();
  if (!containerId) {
    throw new Error(languageErrMsg);
  }

  if (!filePath.includes("\\") && !filePath.includes("/")) {
    filePath = path.join(codeDirectory, filePath);
  }

  // const { input, output } = require(`./testcases/${testcase}`);
  const input = ["1", "2", "3"];
  const output = ["Hello 1\n", "Hello 3\n", "Hello 3\n"];

  let filename = path.basename(filePath);
  const compiledId = await compile(containerId, filename, language);

  for (let index = 0; index < input.length; ++index) {
    const exOut = await execute(
      containerId,
      compiledId,
      languageSpecificDetails[language].inputFunction
        ? languageSpecificDetails[language].inputFunction(input[index])
        : input[index],
      language,
      (data, type, pid) => {
        // console.log(`[${pid}] ${type}: ${data}`);
      },
    );

    console.log(`Testcase ${index + 1}:`);
    console.log("Expected output:", output[index]);
    console.log("Your output:", exOut);

    if (exOut !== output[index]) {
      throw new Error(
        stderrMsgFn({
          index,
          input: input[index],
          output: output[index],
          exOut,
        }),
      );
    }
  }

  return { msg: "All Test Cases Passed" };
};

const Execute = async () => {
  try {
    await initAllDockerContainers();
    const filename = "main.py";
    const language = "py";

    const exeTestcase = await execCodeAgainstTestcases(
      filename,
      language,
      "temp",
    );

    console.log("Exec against Testcases: ", exeTestcase);
  } catch (error: any) {
    console.error("Error: ", error.message);
  }
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
