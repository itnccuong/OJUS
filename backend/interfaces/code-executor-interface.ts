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

export { ContainerConfig, CompExecCmd, InputFunc, LanguageDetail };
