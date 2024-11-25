import { Request, Response, NextFunction, RequestHandler } from "express";
import { CustomError } from "../utils/error";
import { errorResponse, formatResponse } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";

const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log("Error in global error handler:", err);
  if (err instanceof CustomError) {
    return errorResponse(res, err.name, err.message, err.status, err.data);
  }
  return errorResponse(
    res,
    "INTERNAL_SERVER_ERROR",
    "Internal server error",
    STATUS_CODE.INTERNAL_SERVER_ERROR,
    {},
  );
};

export default globalErrorHandler;