import { STATUS_CODE } from "./constants";

export class CustomError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

//Dùng custom class cụ thể, ko dồn hết chung vô 1 custom class vì mỗi class có khi cần log ra các lỗi khác nhau (VD compile err thì có stderr, validation err thì log ra giá trị và range)
//Lúc gửi res thì có thể ko gửi hết value, range,... nhưng có thể dùng để viết vô message
export class CompileError extends CustomError {
  constructor(message: string) {
    super(message, STATUS_CODE.BAD_REQUEST);
  }
}

export class RuntimeError extends CustomError {
  public exitCode: number | undefined | null;
  public pid: number;

  constructor(
    message: string,
    pid: number | undefined,
    exitCode?: number | null,
  ) {
    super(message, STATUS_CODE.BAD_REQUEST);
    this.pid = pid ? pid : 0;
    this.exitCode = exitCode;
  }
}

export class FindTestByProblemIdError extends CustomError {
  public problemId: number;

  constructor(message: string, problemId: number) {
    super(message, STATUS_CODE.NOT_FOUND);
    this.problemId = problemId;
  }
}

export class ConvertLanguageError extends CustomError {
  public language: string;

  constructor(message: string, language: string) {
    super(message, STATUS_CODE.BAD_REQUEST);
    this.language = language;
  }
}

export class FindByIdError extends CustomError {
  public id: number;
  public tableName: string;

  constructor(message: string, id: number, tableName: string) {
    super(message, STATUS_CODE.NOT_FOUND);
    this.id = id;
    this.tableName = tableName;
  }
}

export class GetContainerIdError extends CustomError {
  constructor(message: string) {
    super(message, STATUS_CODE.SERVICE_UNAVAILABLE);
  }
}
