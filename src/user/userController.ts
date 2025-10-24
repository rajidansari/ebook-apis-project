import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "./userSchema.ts";
import { hashPassword } from "../utils/hashPassword.ts";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password) {
    const err = createHttpError(400, "All fields are required");
    return next(err);
  }

  try {
    const isUserAlreadyExist = await User.findOne({ email });
    if (isUserAlreadyExist) {
      console.log(isUserAlreadyExist);
      const err = createHttpError(
        409,
        "Email is already registered, try logging.",
      );
      return next(err);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered", data: newUser });
  } catch (error) {
    console.log(`user register error :: ${error}`);
  }

  res.status(201).json({ message: "User registered" });
};

export { createUser };
