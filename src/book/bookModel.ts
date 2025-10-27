import mongoose, { Schema, model } from "mongoose";
import type { Book } from "./bookTypes.ts";

const bookSchema = new Schema<Book>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

    auther: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    genre: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      required: true,
    },

    file: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default model("Book", bookSchema);
