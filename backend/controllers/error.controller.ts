import { Request, Response, NextFunction, RequestHandler } from "express";
import {
  CompilationError,
  ConvertLanguageError,
  CustomError,
  FindTestByProblemIdError,
  RuntimeError,
} from "../utils/error";
import { formatResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";

const responseError = (res: Response, err: any) => {
  if (err instanceof CustomError) {
    return formatResponse(res, {}, err.statusCode, err.message, err.name);
  }
  return formatResponse(
    res,
    {},
    STATUS_CODE.INTERNAL_SERVER_ERROR,
    err.message,
  );
};

const CompilationErrorHandler = (err: CompilationError) => {
  return err;
};

const runTimeErrorHandler = (err: RuntimeError) => {
  err.message = `Runtime error: process ${err.pid} exited with code ${err.exitCode}`;
  return err;
};

const FindTestByProblemIdErrorHandler = (err: FindTestByProblemIdError) => {
  err.message = `Testcases for problem with id ${err.problemId} not found`;
  return err;
};

const ConvertLanguageErrorHandler = (err: ConvertLanguageError) => {
  err.message = `${err.language} is not a valid language`;
  return err;
};

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error in global error handler:", err);
  if (err instanceof CompilationError) {
    err = CompilationErrorHandler(err);
  }
  if (err instanceof RuntimeError) {
    err = runTimeErrorHandler(err);
  }
  if (err instanceof FindTestByProblemIdError) {
    err = FindTestByProblemIdErrorHandler(err);
  }
  if (err instanceof ConvertLanguageError) {
    err = ConvertLanguageErrorHandler(err);
  }

  return responseError(res, err);
};

export default globalErrorHandler;
