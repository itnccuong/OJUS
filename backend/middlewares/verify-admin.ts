// middleware/verify-admin.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client";
import { formatResponse } from "../utils/formatResponse"; // Ensure this utility exists
import { STATUS_CODE } from "../utils/constants"; // Ensure this utility exists

interface DecodeToken {
  userId: number;
  iat: number;
  exp: number;
}

export const verifyAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract the token from the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      formatResponse(res, "Access Denied: No token provided", STATUS_CODE.UNAUTHORIZED);
      return;
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET as string, async (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          formatResponse(res, "Token expired", STATUS_CODE.UNAUTHORIZED);
        } else {
          formatResponse(res, "Invalid token", STATUS_CODE.UNAUTHORIZED);
        }
        return;
      }

      const userId = (decoded as DecodeToken).userId;

      // Fetch the user from the database
      const user = await prisma.user.findUnique({
        where: { userId },
      });

      if (!user) {
        formatResponse(res, "User not found", STATUS_CODE.NOT_FOUND);
        return;
      }

      if (!user.admin) {
        formatResponse(res, "Access Denied: Admins only", STATUS_CODE.FORBIDDEN);
        return;
      }

      // Optionally attach userId to the request object
      (req as any).userId = userId;

      // Proceed to the next middleware or route handler
      next();
    });
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    formatResponse(res, "Internal Server Error", STATUS_CODE.INTERNAL_SERVER_ERROR);
  }
};
