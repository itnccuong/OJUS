import { exec, spawn } from "child_process";
import path from "path";
import { promisify } from "node:util";
import { CompilationError, RuntimeError } from "../../utils/error";
import {
  commandDetailsType,
  ContainerConfig,
  containerNames,
  imageIndex,
  imageNames,
  LanguageDetail,
} from "../../interfaces/code-executor-interface";

const codeFiles = "codeFiles";
const STDOUT = "stdout";
const STDERR = "stderr";
const codeDirectory = path.join(__dirname, codeFiles);

//Convert callback function to promise to use await
const execAsync = promisify(exec);

const containerIds: string[] = [];

const commandDetails: Record<string, commandDetailsType> = {
  c: {
    compilerCmd: (id) =>
      `gcc ./${codeFiles}/${id}.c -o ./${codeFiles}/${id}.out -lpthread -lrt`,
    executorCmd: (id) => `./${codeFiles}/${id}.out`,
  },
  cpp: {
    compilerCmd: (id) =>
      `g++ ./${codeFiles}/${id}.cpp -o ./${codeFiles}/${id}.out`,
    executorCmd: (id) => `./${codeFiles}/${id}.out`,
  },
  py: {
    compilerCmd: null,
    executorCmd: (id) => `python ./${codeFiles}/${id}`,
  },
  js: {
    compilerCmd: null,
    executorCmd: (id) => `node ./${codeDirectory}/${id}`,
  },
  java: {
    compilerCmd: (id) =>
      `javac -d ./${codeDirectory}/${id} ./${codeDirectory}/${id}.java`,
    executorCmd: (id) => `java -cp ./${codeDirectory}/${id} Solution`,
  },
};

const languageDetails: Record<string, LanguageDetail> = {
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

/**
 * Creates a Docker container.
 * @param config - Container configuration with name and image.
 * @returns Promise<string> - Returns the container ID.
 */

const createContainer = async (config: ContainerConfig) => {
  const { name, image } = config;
  const result = await execAsync(
    `docker run -i -d --rm --memory=100m --mount type=bind,src="${codeDirectory}",dst=/${codeFiles} --name ${name} --label oj=oj ${image}`,
  );
  //Return container id
  return result.stdout.trim();
};

/**
 * Stops a Docker container.
 * @param container_name - The container ID or name.
 * @returns Promise<string> - Returns the container ID or name.
 */
const getContainerId = async (container_name: string) => {
  const running = await execAsync(
    `docker container ps --filter "name=${container_name}" --format "{{.ID}}"`,
  );
  return running.stdout.trim();
};
// const killContainer = async (container_id_name: string) => {
//   const running = await getContainerId(container_id_name);
//   if (running) {
//     const result = await execAsync(`docker kill ${container_id_name}`);
//     if (result.stdout) process.stdout.write(`Deleted: ${result.stdout}`);
//   }
//   return container_id_name;
// };

const initDockerContainer = async (image: string, index: number) => {
  const name = containerNames[index];
  // check and kill already running container
  // await killContainer(name);
  // now create a new container of image
  const container_id = await getContainerId(name);

  if (!container_id) {
    containerIds[index] = await createContainer({ name, image });
    console.log(`${name} created`);
  } else {
    containerIds[index] = container_id;
  }
};

const initAllDockerContainers = async () => {
  await Promise.all(
    imageNames.map((image, index) => initDockerContainer(image, index)),
  );
  console.log("\nAll containers initialized");
};

/**
 * Compiles the code inside a Docker container.
 * @param containerId - The container ID.
 * @param filename - The file name to compile.
 * @param language - The language of the file.
 * @returns Promise<string> - Returns the file ID.
 */
const compile = async (
  containerId: string,
  filename: string,
  language: string,
) => {
  const id = filename.split(".")[0];
  const command = commandDetails[language].compilerCmd
    ? commandDetails[language].compilerCmd(id)
    : null;

  if (!command) {
    return filename;
  }

  try {
    await execAsync(`docker exec ${containerId} ${command}`);
    return id;
  } catch (error: any) {
    throw new CompilationError(error.stderr);
  }
};

/**
 * Executes the compiled code or code inside a Docker container.
 * @param containerId - The container ID.
 * @param filename - The file name to execute.
 * @param input - The input to pass to the program.
 * @param language - The language of the file.
 * @param onProgress - Callback for progress events.
 * @returns Promise<string> - Returns the execution output.
 */

const execute = async (
  containerId: string,
  filename: string,
  input: string,
  language: string,
  onProgress: (data: string, type: string, pid: number) => void | null,
): Promise<string> => {
  const command = commandDetails[language].executorCmd(filename);

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

    cmd.stdin.on("error", (err) => {
      reject(new RuntimeError(err.message));
    });

    cmd.stdout.on("data", (data) => {
      stdout += data.toString();
      if (onProgress && cmd.pid !== undefined) {
        onProgress(data.toString(), STDOUT, cmd.pid);
      }
    });

    cmd.stderr.on("data", (data) => {
      stderr += data.toString();
      if (onProgress && cmd.pid !== undefined) {
        onProgress(data.toString(), STDERR, cmd.pid);
      }
    });

    cmd.on("error", (err) => {
      reject(new RuntimeError(err.message));
    });

    cmd.on("close", (code) => {
      if (code !== 0) {
        reject(
          new RuntimeError(
            `Runtime error: Process ${cmd.pid} exited with code ${code}`,
            code,
          ),
        );
      } else {
        resolve(stdout);
      }
    });
    // cmd.on("close", (code) => {
    //     console.log("code number", code);
    //     if (code !== 0) {
    //         reject(new RuntimeError(stderr, code));
    //     } else {
    //         resolve(stdout);
    //     }
    // });
  });
};

export {
  createContainer,
  compile,
  execute,
  codeDirectory,
  initAllDockerContainers,
  languageDetails,
};
