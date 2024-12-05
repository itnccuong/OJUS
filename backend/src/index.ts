import { app } from "./app";
import { initAllDockerContainers } from "../services/problem.services/code-executor/executor-utils";
require("dotenv").config();

initAllDockerContainers().catch((err) => {
  console.log(err);
});

// server
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
