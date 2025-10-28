import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

export interface AuthRequest extends Request {
  userId: string;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return next(createHttpError(401, "Authorization token not found"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret as string);

    const _req = req as AuthRequest;
    _req.userId = decoded.sub as string;

    next();
  } catch (err: any) {
    return next(createHttpError(401, "Token is expired"));
  }
};

export default authenticate;
