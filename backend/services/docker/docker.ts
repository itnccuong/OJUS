import { exec, spawn } from "child_process";
import path from "path";
import { promisify } from "node:util";
import { CompileError } from "../../utils/error";
// import { AppError, ErrorName } from "../../utils/error";
const codeDirectory = path.join(__dirname, "codeFiles");

const execAsync = promisify(exec);
const spawnAsync = promisify(spawn);

const STDOUT = "stdout";
const STDERR = "stderr";

interface ContainerConfig {
  name: string;
  image: string;
}

type CompExecCmd = (id: string) => string;

interface ExecDetail {
  compilerCmd: CompExecCmd | null;
  executorCmd: CompExecCmd;
}

const details: Record<string, ExecDetail> = {
  c: {
    compilerCmd: (id) =>
      `gcc ./codeFiles/${id}.c -o ./codeFiles/${id}.out -lpthread -lrt`,
    executorCmd: (id) => `./codeFiles/${id}.out`,
  },
  cpp: {
    compilerCmd: (id) => `g++ ./codeFiles/${id}.cpp -o ./codeFiles/${id}.out`,
    executorCmd: (id) => `./codeFiles/${id}.out`,
  },
  py: {
    compilerCmd: null,
    executorCmd: (id) => `python ./codeFiles/${id}`,
  },
  js: {
    compilerCmd: null,
    executorCmd: (id) => `node ./codeFiles/${id}`,
  },
  java: {
    compilerCmd: (id) => `javac -d ./codeFiles/${id} ./codeFiles/${id}.java`,
    executorCmd: (id) => `java -cp ./codeFiles/${id} Solution`,
  },
};

/**
 * Creates a Docker container.
 * @param config - Container configuration with name and image.
 * @returns Promise<string> - Returns the container ID.
 */
// const createContainer = async (config: ContainerConfig): Promise<string> => {
//   const { name, image } = config;
//   return new Promise((resolve, reject) => {
//     exec(
//       `docker run -i -d --rm --memory=100m --mount type=bind,src="${codeDirectory}",dst=/codeFiles --name ${name} --label oj=oj ${image}`,
//       (error, stdout, stderr) => {
//         if (error || stderr) {
//           return reject({ msg: "on docker error", error, stderr });
//         }
//         const containerId = stdout.trim();
//         resolve(containerId);
//       },
//     );
//   });
// };
const createContainer = async (config: ContainerConfig) => {
  const { name, image } = config;
  const result = await execAsync(
    `docker run -i -d --rm --memory=100m --mount type=bind,src="${codeDirectory}",dst=/codeFiles --name ${name} --label oj=oj ${image}`,
  );
  const containerId = result.stdout.trim();
  return containerId;
};

/**
 * Stops a Docker container.
 * @param container_id_name - The container ID or name.
 * @returns Promise<string> - Returns the container ID or name.
 */
const killContainer = async (container_id_name: string): Promise<string> => {
  return new Promise((resolve) => {
    exec(`docker kill ${container_id_name}`, (error, stdout) => {
      if (stdout) console.log("Deleted(stopped):", stdout);
      resolve(container_id_name);
    });
  });
};

/**
 * Compiles the code inside a Docker container.
 * @param containerId - The container ID.
 * @param filename - The file name to compile.
 * @param language - The language of the file.
 * @returns Promise<string> - Returns the file ID.
 */
// const compile = async (
//   containerId: string,
//   filename: string,
//   language: string,
// ): Promise<string> => {
//   const id = filename.split(".")[0];
//   const command = details[language]?.compilerCmd
//     ? details[language].compilerCmd(id)
//     : null;
//
//   if (!command) return filename;
//
//   return new Promise((resolve, reject) => {
//     exec(`docker exec ${containerId} ${command}`, (error, stdout, stderr) => {
//       if (error) return reject({ msg: "on error", error, message: stderr });
//       if (stderr) return reject({ msg: "on stderr", message: stderr });
//       resolve(id);
//     });
//   });
// };
const compile = async (
  containerId: string,
  filename: string,
  language: string,
) => {
  const id = filename.split(".")[0];
  const command = details[language].compilerCmd
    ? details[language].compilerCmd(id)
    : null;

  if (!command) {
    return filename;
  }

  try {
    await execAsync(`docker exec ${containerId} ${command}`);
    return id;
  } catch (error: any) {
    console.log(error);
    throw new CompileError(error.stderr);
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
  const command = details[language].executorCmd(filename);

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
      reject({ msg: "on stdin error", error: `${err}` });
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

    cmd.on("error", (error) => reject(error));

    cmd.on("close", (code) => {
      if (code !== 0) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

export { createContainer, killContainer, compile, execute, STDOUT, STDERR };
