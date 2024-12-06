import { exec, spawn } from "child_process";
import path from "path";
import { promisify } from "node:util";
import {
  ContainerConfig,
  ExecuteInterface,
  LanguageDetail,
} from "../../../interfaces/code-executor-interface";
import { getContainerId } from "../submit.services";

const codeFiles = "codeFiles";
const STDOUT = "stdout";
const STDERR = "stderr";
const codeDirectory = path.join(__dirname, codeFiles);

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

/**
 * Creates a Docker container.
 * @param container - Container configuration with name and image.
 * @returns Promise<string> - Returns the container ID.
 */

const createContainer = async (container: ContainerConfig) => {
  const { name, image } = container;
  const result = await execAsync(
    `docker run -i -d --rm --mount type=bind,src="${codeDirectory}",dst=/${codeFiles} --name ${name} --label oj=oj ${image}`,
  );
  return result.stdout.trim();
};

/**
 * Get container id
 * @param container_name - The container ID or name.
 * @returns Promise<string> - Returns the container ID.
 */
const getContainerIdByName = async (container_name: string) => {
  const running = await execAsync(
    `docker container ps --filter "name=${container_name}" --format "{{.ID}}"`,
  );
  return running.stdout.trim();
};

/**
 * Stop a running container
 * @param container_name
 */
const killContainer = async (container_name: string) => {
  await execAsync(`docker kill ${container_name}`);
};

/**
 * Create new container if not created yet
 * @param container - Container configuration with name and image.
 */
const initDockerContainer = async (container: ContainerConfig) => {
  const name = container.name;
  const container_id = await getContainerIdByName(name);

  if (container_id) {
    await killContainer(container_id);
    // console.log(`Container ${name} stopped`);
  }
  container.id = await createContainer(container);
  // console.log(`Container ${name} created`);
};

/**
 * Initialize all docker from container list
 */
const initAllDockerContainers = async () => {
  await Promise.all(
    Object.values(containers).map((container) =>
      initDockerContainer(container),
    ),
  );
  console.log("\nAll containers initialized");
};

/**
 * Compiles the code inside a Docker container. Return new filename that removed the extension. Ex: main.cpp -> main
 * @param filename - The file name to compile.
 * @param language - The language of the file.
 * @returns Promise<string | null> - Returns the filename if compile successfully, otherwise null.
 */
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

/**
 * Executes the compiled code or code inside a Docker container.
 * @param filename - The file name to execute.
 * @param input - The input to pass to the program.
 * @param expectedOutput - Expected output
 * @param language - The language of the file.
 * @param timeLimit - Time limit
 * @returns Promise<string> - Returns the verdict
 */
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
      stdout = stdout.trim();
      clearTimeout(timeoutId);
      if (isTimeout) {
        resolve({
          stderr: stderr,
          stdout: stdout,
          verdict: "TIME_LIMIT_EXCEEDED",
        });
      }
      if (exitCode !== 0) {
        resolve({
          stderr: stderr,
          stdout: "",
          verdict: "RUNTIME_ERROR",
        });
      }
      if (stdout !== expectedOutput) {
        resolve({
          stderr: stderr,
          stdout: stdout,
          verdict: "WRONG_ANSWER",
        });
      }
      resolve({
        stderr: stderr,
        stdout: stdout,
        verdict: "OK",
      });
    });
  });
};

export {
  createContainer,
  compile,
  executeAgainstTestcase,
  codeDirectory,
  initAllDockerContainers,
  languageDetails,
};
