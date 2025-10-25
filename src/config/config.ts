import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  environment: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
};

export const config = Object.freeze(_config);
