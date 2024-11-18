interface ContainerConfig {
  name: string;
  image: string;
}
// interface commandDetailsType {
//   compilerCmd: CompExecCmd | null;
//   executorCmd: CompExecCmd;
// }

type CompExecCmd = (id: string) => string;
type InputFunc = (id: string) => string;
interface LanguageDetail {
  compiledExtension: string;
  containerId: () => string;
  inputFunction: InputFunc | null;
  compilerCmd: CompExecCmd | null;
  executorCmd: CompExecCmd;
}

const imageIndex = { GCC: 0, PY: 1, JS: 2, JAVA: 3 };
const imageNames = [
  "gcc:latest",
  "python:3.10-slim",
  "node:16.17.0-bullseye-slim",
  "openjdk:20-slim",
];
const containerNames = [
  "gcc-container",
  "py-container",
  "js-container",
  "java-container",
];

export {
  ContainerConfig,
  CompExecCmd,
  InputFunc,
  LanguageDetail,
  imageIndex,
  imageNames,
  containerNames,
};
