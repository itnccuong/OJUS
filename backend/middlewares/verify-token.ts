import { formatResponseNew } from "../utils/formatResponse";
import { STATUS_CODE } from "../utils/constants";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface DecodeToken {
  userId: number;
  iat: number;
  exp: number;
}

declare module "express-serve-static-core" {
  export interface Request {
    userId: number;
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Access Denied: No token provided",
    });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return formatResponseNew(
          res,
          "UNAUTHORIZED",
          "Token expired",
          STATUS_CODE.UNAUTHORIZED,
          {},
        );
      } else {
        return formatResponseNew(
          res,
          "UNAUTHORIZED",
          "Invalid token",
          STATUS_CODE.UNAUTHORIZED,
          {},
        );
      }
    } else {
      req.userId = (decoded as DecodeToken).userId;
      next();
    }
  });
};
