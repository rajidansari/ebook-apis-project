import mongoose from "mongoose";
import { config } from "./config.ts";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB Connected.");
    });

    mongoose.connection.on("error", (err) => {
      console.log(`Error in connecting to database :: ${err}`);
    });

    await mongoose.connect(config.mongoUri as string);
  } catch (err) {
    console.log(`DB connection error :: ${err}`);
    process.exit(1);
  }
};

export default connectDB;
