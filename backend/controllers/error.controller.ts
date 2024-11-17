import { Request, Response, NextFunction, RequestHandler } from "express";
import { CompilationError } from "../utils/error";
import { formatResponse, STATUS_CODE } from "../utils/services";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(err);
  if (err instanceof CompilationError) {
    return formatResponse(res, {}, err.statusCode, err.message, err.name);
  } else {
    return formatResponse(
      res,
      {},
      STATUS_CODE.INTERNAL_SERVER_ERROR,
      err.message,
    );
  }
};

export default globalErrorHandler;
