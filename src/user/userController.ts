import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "./userSchema.ts";
import { hashPassword } from "../utils/hashPassword.ts";
import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

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

    const accessToken = jwt.sign(
      { sub: newUser._id },
      config.jwtSecret as string,
      {
        expiresIn: "7d",
      },
    );

    res
      .status(201)
      .json({ message: "User registered successfully", accessToken });
  } catch (error: any) {
    return next(createHttpError(500, error.message));
  }
};

export { createUser };
