import { Request } from "express";

export interface ContainerConfig {
  name: string;
  image: string;
  id: string;
}

export type CompExecCmd = (id: string) => string;
export type InputFunc = (id: string) => string;

export interface LanguageDetail {
  compiledExtension: string;
  inputFunction: InputFunc | null;
  compilerCmd: CompExecCmd | null;
  executorCmd: CompExecCmd;
  container: ContainerConfig;
}

export interface ExecuteInterface {
  stdout: string;
  verdict:
    | "WRONG_ANSWER"
    | "OK"
    | "TIME_LIMIT_EXCEEDED"
    | "MEMORY_LIMIT_EXCEEDED";
}

export interface UserConfig {
  userId: number;
  username: string;
  email: string;
  fullname: string;
  password: string;
}

export interface testcaseInterface {
  input: string[];
  output: string[];
}

export interface LoginRequest extends Request {
  body: {
    usernameOrEmail: string;
    password: string;
  };
}
