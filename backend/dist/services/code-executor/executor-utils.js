"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.languageDetails = exports.initAllDockerContainers = exports.codeDirectory = exports.executeAgainstTestcase = exports.compile = exports.createContainer = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const node_util_1 = require("node:util");
const submit_services_1 = require("../problem.services/submit.services");
const codeFiles = "codeFiles";
const STDOUT = "stdout";
const STDERR = "stderr";
const codeDirectory = path_1.default.join(__dirname, codeFiles);
exports.codeDirectory = codeDirectory;
//Convert callback function to promise to use await
const execAsync = (0, node_util_1.promisify)(child_process_1.exec);
const containers = {
    gcc: {
        image: "gcc:latest",
        name: "gcc-container",
        id: "",
    },
    py: {
        image: "python:3.10-slim",
        name: "py-container",
        id: "",
    },
    js: {
        image: "node:16.17.0-bullseye-slim",
        name: "js-container",
        id: "",
    },
    java: {
        image: "openjdk:20-slim",
        name: "java-container",
        id: "",
    },
};
const languageDetails = {
    c: {
        inputFunction: null,
        compilerCmd: (filename) => `gcc ./${codeFiles}/${filename}.c -o ./${codeFiles}/${filename}.out -lpthread -lrt`,
        executorCmd: (filename) => `./${codeFiles}/${filename}.out`,
        container: containers.gcc,
    },
    cpp: {
        inputFunction: null,
        compilerCmd: (filename) => `g++ ./${codeFiles}/${filename}.cpp -o ./${codeFiles}/${filename}.out`,
        executorCmd: (filename) => `./${codeFiles}/${filename}.out`,
        container: containers.gcc,
    },
    py: {
        inputFunction: (data) => (data ? data.split(" ").join("\n") : ""),
        compilerCmd: null,
        executorCmd: (filename) => `python ./${codeFiles}/${filename}.py`,
        container: containers.py,
    },
    js: {
        inputFunction: null,
        compilerCmd: null,
        executorCmd: (filename) => `node ./${codeFiles}/${filename}.js`,
        container: containers.js,
    },
    java: {
        inputFunction: null,
        compilerCmd: (filename) => `javac -d ./${codeFiles}/${filename} ./${codeFiles}/${filename}.java`,
        executorCmd: (filename) => `java -cp ./${codeFiles}/${filename} Solution`,
        container: containers.java,
    },
};
exports.languageDetails = languageDetails;
/**
 * Creates a Docker container.
 * @param container - Container configuration with name and image.
 * @returns Promise<string> - Returns the container ID.
 */
const createContainer = (container) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, image } = container;
    const result = yield execAsync(`docker run -i -d --rm --mount type=bind,src="${codeDirectory}",dst=/${codeFiles} --name ${name} --label oj=oj ${image}`);
    return result.stdout.trim();
});
exports.createContainer = createContainer;
/**
 * Get container id
 * @param container_name - The container ID or name.
 * @returns Promise<string> - Returns the container ID.
 */
const getContainerIdByName = (container_name) => __awaiter(void 0, void 0, void 0, function* () {
    const running = yield execAsync(`docker container ps --filter "name=${container_name}" --format "{{.ID}}"`);
    return running.stdout.trim();
});
/**
 * Stop a running container
 * @param container_name
 */
const killContainer = (container_name) => __awaiter(void 0, void 0, void 0, function* () {
    yield execAsync(`docker kill ${container_name}`);
});
/**
 * Create new container if not created yet
 * @param container - Container configuration with name and image.
 */
const initDockerContainer = (container) => __awaiter(void 0, void 0, void 0, function* () {
    const name = container.name;
    const container_id = yield getContainerIdByName(name);
    if (container_id) {
        yield killContainer(container_id);
        console.log(`Container ${name} stopped`);
    }
    container.id = yield createContainer(container);
    console.log(`Container ${name} created`);
});
/**
 * Initialize all docker from container list
 */
const initAllDockerContainers = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(Object.values(containers).map((container) => initDockerContainer(container)));
    console.log("\nAll containers initialized");
});
exports.initAllDockerContainers = initAllDockerContainers;
/**
 * Compiles the code inside a Docker container. Return new filename that removed the extension. Ex: main.cpp -> main
 * @param filename - The file name to compile.
 * @param language - The language of the file.
 * @returns Promise<string | null> - Returns the filename if compile successfully, otherwise null.
 */
const compile = (filename, language) => __awaiter(void 0, void 0, void 0, function* () {
    const filenameWithoutExtension = filename.split(".")[0];
    const command = languageDetails[language].compilerCmd
        ? languageDetails[language].compilerCmd(filenameWithoutExtension)
        : null;
    if (!command) {
        return { filenameWithoutExtension: filenameWithoutExtension, stderr: null };
    }
    try {
        const container = languageDetails[language].container;
        const containerId = (0, submit_services_1.getContainerId)(container);
        yield execAsync(`docker exec ${containerId} ${command}`);
        return { filenameWithoutExtension: filenameWithoutExtension, stderr: null };
    }
    catch (error) {
        return {
            filenameWithoutExtension: filenameWithoutExtension,
            stderr: error.stderr,
        };
    }
});
exports.compile = compile;
/**
 * Executes the compiled code or code inside a Docker container.
 * @param filename - The file name to execute.
 * @param input - The input to pass to the program.
 * @param expectedOutput - Expected output
 * @param language - The language of the file.
 * @param timeLimit - Time limit
 * @returns Promise<string> - Returns the verdict
 */
const executeAgainstTestcase = (filename, input, expectedOutput, language, timeLimit) => __awaiter(void 0, void 0, void 0, function* () {
    const container = languageDetails[language].container;
    const containerId = (0, submit_services_1.getContainerId)(container);
    const command = languageDetails[language].executorCmd(filename);
    if (!command)
        throw new Error("Language Not Supported");
    return new Promise((resolve, reject) => {
        const cmd = (0, child_process_1.spawn)("docker", ["exec", "-i", `${containerId} ${command}`], {
            shell: true,
        });
        let stdout = "";
        let stderr = "";
        if (input) {
            cmd.stdin.write(input);
            cmd.stdin.end();
        }
        let isTimeout = false;
        const timeoutId = setTimeout(() => {
            isTimeout = true;
            cmd.stdout.destroy();
            cmd.kill();
        }, timeLimit);
        cmd.stdin.on("error", (err) => {
            reject(new Error(err.message));
        });
        cmd.stdout.on("data", (data) => {
            stdout += data.toString();
        });
        cmd.stderr.on("data", (data) => {
            stderr += data.toString();
        });
        cmd.on("error", (err) => {
            reject(new Error(err.message));
        });
        //Can also use close instead of exit?
        cmd.on("exit", (exitCode) => {
            clearTimeout(timeoutId);
            if (isTimeout) {
                resolve({
                    stdout: stdout,
                    verdict: "TIME_LIMIT_EXCEEDED",
                });
            }
            if (exitCode !== 0) {
                resolve({
                    stdout: "",
                    verdict: "RUNTIME_ERROR",
                });
            }
            if (stdout !== expectedOutput) {
                resolve({
                    stdout: stdout,
                    verdict: "WRONG_ANSWER",
                });
            }
            resolve({
                stdout: stdout,
                verdict: "OK",
            });
        });
    });
});
exports.executeAgainstTestcase = executeAgainstTestcase;
