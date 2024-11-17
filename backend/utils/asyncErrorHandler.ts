import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncErrorHandler =
  <
    Req extends Request = Request, // default to Request if no specific type provided
  >(
    fn: (req: Req, res: Response, next: NextFunction) => Promise<any>,
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as Req, res, next)).catch(next);
  };

export default asyncErrorHandler;
