import { STATUS_CODE } from "./services";
// Define error types as a const object
// export enum ErrorName {
//   COMPILATION = "COMPILATION_ERROR",
//   RUNTIME = "RUNTIME_ERROR",
// }

//Dùng custom class cụ thể, ko dồn hết chung vô 1 custom class vì mỗi class có khi cần log ra các lỗi khác nhau (VD compile err thì có stderr, validation err thì log ra giá trị và range)
//Lúc gửi res thì có thể ko gửi hết value, range,... nhưng có thể dùng để viết vô message
export class CompilationError extends Error {
  public statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = STATUS_CODE.BAD_REQUEST;
    this.name = this.constructor.name;
  }
}

export class RuntimeError extends Error {
  public statusCode: number;
  public exitCode: number | undefined | null;

  constructor(message: string, exitCode?: number | null) {
    super(message);
    this.exitCode = exitCode;
    this.statusCode = STATUS_CODE.BAD_REQUEST;
    this.name = this.constructor.name;
  }
}

// // If this return true, then the error is set to be an instance of AppError
// export const isErrorName = (error: any, name: ErrorName): error is AppError =>
//   error instanceof AppError && error.name === name;
