import { exec, spawn } from "child_process";
import { promisify } from "node:util";
import {
  ContainerConfig,
  ExecuteInterface,
  LanguageDetail,
} from "../interfaces/code-executor-interface";
import { CustomError } from "./errorClass";
import { STATUS_CODE } from "./constants";

const codeFiles = "codeFiles";

//Convert callback function to promise to use await
const execAsync = promisify(exec);

const containers: Record<string, ContainerConfig> = {
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

const languageDetails: Record<string, LanguageDetail> = {
  c: {
    compilerCmd: (filename) =>
      `gcc ./${codeFiles}/${filename}.c -o ./${codeFiles}/${filename}.out -lpthread -lrt`,
    executorCmd: (filename) => `./${codeFiles}/${filename}.out`,
    container: containers.gcc,
  },
  cpp: {
    compilerCmd: (filename) =>
      `g++ ./${codeFiles}/${filename}.cpp -o ./${codeFiles}/${filename}.out`,
    executorCmd: (filename) => `./${codeFiles}/${filename}.out`,
    container: containers.gcc,
  },
  py: {
    compilerCmd: null,
    executorCmd: (filename) => `python ./${codeFiles}/${filename}.py`,
    container: containers.py,
  },
  js: {
    compilerCmd: null,
    executorCmd: (filename) => `node ./${codeFiles}/${filename}.js`,
    container: containers.js,
  },
  java: {
    compilerCmd: (filename) =>
      `javac -d ./${codeFiles}/${filename} ./${codeFiles}/${filename}.java`,
    executorCmd: (filename) => `java -cp ./${codeFiles}/${filename} Solution`,
    container: containers.java,
  },
};

const getContainerIdByName = async (container_name: string) => {
  const running = await execAsync(
    `docker container ps --filter "name=${container_name}" --format "{{.ID}}"`,
  );
  console.log("Get container id by name", running.stdout.trim());
  return running.stdout.trim();
};

const initDockerContainer = async (container: ContainerConfig) => {
  const name = container.name;
  container.id = await getContainerIdByName(name);
};

const initAllDockerContainers = async () => {
  await Promise.all(
    Object.values(containers).map((container) =>
      initDockerContainer(container),
    ),
  );
  console.log("\nAll containers initialized");
};

export const getContainerId = (container: ContainerConfig) => {
  const containerId = container.id;

  if (!containerId) {
    throw new CustomError("Container id not found", STATUS_CODE.BAD_REQUEST);
  }
  return containerId;
};

const compile = async (filename: string, language: string) => {
  const filenameWithoutExtension = filename.split(".")[0];
  const command = languageDetails[language].compilerCmd
    ? languageDetails[language].compilerCmd(filenameWithoutExtension)
    : null;

  if (!command) {
    return { filenameWithoutExtension: filenameWithoutExtension, stderr: "" };
  }

  try {
    const container = languageDetails[language].container;
    const containerId = getContainerId(container);
    await execAsync(`docker exec ${containerId} ${command}`);
    return { filenameWithoutExtension: filenameWithoutExtension, stderr: "" };
  } catch (error: any) {
    return {
      filenameWithoutExtension: filenameWithoutExtension,
      stderr: error.stderr as string,
    };
  }
};

const executeAgainstTestcase = async (
  filename: string,
  input: string,
  expectedOutput: string,
  language: string,
  timeLimit: number,
): Promise<ExecuteInterface> => {
  const container = languageDetails[language].container;
  const containerId = getContainerId(container);

  const command = languageDetails[language].executorCmd(filename);

  if (!command) throw new Error("Language Not Supported");

  return new Promise((resolve, reject) => {
    const cmd = spawn("docker", ["exec", "-i", `${containerId} ${command}`], {
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
      cmd.kill('SIGKILL');
    }, timeLimit);

    const startTime = process.hrtime(); // Start tracking time

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
      stdout = stdout.trim();
      clearTimeout(timeoutId);

      // Calculate execution time
      const [seconds, nanoseconds] = process.hrtime(startTime);
      const executionTime = Math.min(
        timeLimit,
        Math.floor(seconds * 1000 + nanoseconds / 1e6),
      );

      if (isTimeout) {
        resolve({
          stderr: stderr,
          stdout: stdout,
          verdict: "TIME_LIMIT_EXCEEDED",
          time: executionTime,
        });
      }
      if (exitCode !== 0) {
        resolve({
          stderr: stderr,
          stdout: "",
          verdict: "RUNTIME_ERROR",
          time: executionTime,
        });
      }
      if (stdout.trimEnd() !== expectedOutput.trimEnd()) {
        resolve({
          stderr: stderr,
          stdout: stdout,
          verdict: "WRONG_ANSWER",
          time: executionTime,
        });
      }
      resolve({
        stderr: stderr,
        stdout: stdout,
        verdict: "OK",
        time: executionTime,
      });
    });
  });
};

export {
  compile,
  executeAgainstTestcase,
  initAllDockerContainers,
  languageDetails,
};
