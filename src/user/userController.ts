import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import User from "./userSchema.ts";
import { hashPassword } from "../utils/hashPassword.ts";
import comparePassword from "../utils/comparePassword.ts";
import generateAccessToken from "../utils/generateAccessToken.ts";

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

    const accessToken = generateAccessToken(newUser._id);

    res
      .status(201)
      .json({ message: "User registered successfully", accessToken });
  } catch (error: any) {
    return next(createHttpError(500, error.message));
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(createHttpError(404, "Invalid email or password"));
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return next(createHttpError(404, "Invalid email or password"));
    }

    const accessToken = generateAccessToken(user._id);

    res.status(200).json({ message: "logged in successfully", accessToken });
  } catch (error: any) {
    return next(createHttpError(404, error.message));
  }
};

export { createUser, loginUser };
