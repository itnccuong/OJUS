"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const executor_utils_1 = require("../services/problem.services/code-executor/executor-utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dir = path_1.default.join("codeFiles");
if (!fs_1.default.existsSync(dir)) {
    fs_1.default.mkdirSync(dir, { recursive: true });
}
(0, executor_utils_1.initAllDockerContainers)().catch((err) => {
    console.log(err);
});
// server
const PORT = process.env.PORT || 8080;
app_1.app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
//Test watch tower cleanup 22
