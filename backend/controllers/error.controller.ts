import { Request, Response, NextFunction, RequestHandler } from "express";
import { CompileError } from "../utils/error";
import { formatResponse, STATUS_CODE } from "../utils/services";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("POWPDOPWEKE", err);
  if (err instanceof CompileError) {
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
