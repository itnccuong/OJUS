"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const executor_utils_1 = require("../services/code-executor/executor-utils");
require("dotenv").config();
(0, executor_utils_1.initAllDockerContainers)().catch((err) => {
    console.log(err);
});
// server
const PORT = process.env.PORT || 8000;
app_1.app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
