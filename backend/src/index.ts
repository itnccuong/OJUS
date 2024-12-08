import { app } from "./app";
import { initAllDockerContainers } from "../services/problem.services/code-executor/executor-utils";
require("dotenv").config();

//make dir services/problem.services/code-executor/codeFiles if not exist
const fs = require("fs");
const path = require("path");
const dir = path.join("codeFiles");

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

initAllDockerContainers().catch((err) => {
  console.log(err);
});

// server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
