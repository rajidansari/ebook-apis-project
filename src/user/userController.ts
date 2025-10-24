import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    const err = createHttpError(400, "All fields are required");
    return next(err);
  }

  res.status(201).json({ message: "User registered" });
};

export { createUser };
