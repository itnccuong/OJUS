import { formatResponse, STATUS_CODE } from '../utils/services';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: jwt.JwtPayload;
}

export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.headers['authorization']?.split(' ')[1];

  console.log(token);

  if (!token) {
    res.status(401).json({
      message: 'Access Denied: No token provided'
    });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {

        return formatResponse(
          res,
          {},
          STATUS_CODE.UNAUTHORIZED,
          err.message,
        );
      } else {
        return formatResponse(
          res,
          {},
          STATUS_CODE.UNAUTHORIZED,
          err.message,
        );
      }
    } else {
      req.user = decoded as jwt.JwtPayload;
      next();
    }
  });
};