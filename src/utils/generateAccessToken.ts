import jwt from "jsonwebtoken";
import { config } from "../config/config.ts";

const generateAccessToken = (userId: string): string => {
  return jwt.sign({ sub: userId }, config.jwtSecret as string, {
    expiresIn: "7d",
  });
};

export default generateAccessToken;
