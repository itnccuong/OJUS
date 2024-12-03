export interface ContainerConfig {
  name: string;
  image: string;
  id: string;
}

export type CompExecCmd = (id: string) => string;
export type InputFunc = (id: string) => string;

export interface LanguageDetail {
  inputFunction: InputFunc | null;
  compilerCmd: CompExecCmd | null;
  executorCmd: CompExecCmd;
  container: ContainerConfig;
}

export interface ExecuteInterface {
  stderr: string;
  stdout: string;
  verdict:
    | "WRONG_ANSWER"
    | "OK"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED"
    | "RUNTIME_ERROR";
}

export interface TestcaseInterface {
  input: string[];
  output: string[];
}
