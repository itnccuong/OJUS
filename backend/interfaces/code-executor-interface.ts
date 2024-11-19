interface ContainerConfig {
  name: string;
  image: string;
  id: string;
}

type CompExecCmd = (id: string) => string;
type InputFunc = (id: string) => string;

interface LanguageDetail {
  compiledExtension: string;
  inputFunction: InputFunc | null;
  compilerCmd: CompExecCmd | null;
  executorCmd: CompExecCmd;
  container: ContainerConfig;
}

interface ExecuteInterface {
  stdout: string;
  verdict:
    | "WRONG_ANSWER"
    | "OK"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED";
}

export {
  ContainerConfig,
  CompExecCmd,
  InputFunc,
  LanguageDetail,
  ExecuteInterface,
};
