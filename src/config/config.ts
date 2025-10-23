import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
};

export const config = Object.freeze(_config);
