import { app } from "./app";
import { initAllDockerContainers } from "../services/problem.services/code-executor/executor-utils";
import fs from "fs";
import path from "path";
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
//Test watch tower cleanup 22
