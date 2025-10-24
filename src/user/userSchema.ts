import { Schema, model } from "mongoose";
import type { User } from "./userTypes.ts";

const userSchema = new Schema<User>(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "Must include atleast 3 characters"],
    },

    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
      minLength: [8, "Password should be atleast 8 characters long."],
    },
  },
  { timestamps: true },
);

export default model<User>("User", userSchema);
