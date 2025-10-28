import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import cloudinary from "../config/cloudinary.ts";
import path from "node:path";
import fs from "node:fs/promises";
import Book from "./bookModel.ts";
import type { AuthRequest } from "../middlewares/authenticate.ts";
import coverImageInfo from "../utils/coverImageInfo.ts";
import bookFileInfo from "../utils/bookFileInfo.ts";

const createBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, genre } = req.body;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // coverImage info's
  const { coverImageFileName, coverImageFilePath, coverImageMimeTye } =
    coverImageInfo(files);

  // bookFile info's
  const { bookFileName, bookFilePath, bookFormat } = bookFileInfo(files);

  try {
    const coverImageUploadResult = await cloudinary.uploader.upload(
      coverImageFilePath,
      {
        filename_override: coverImageFileName,
        folder: "cover-images",
        format: coverImageMimeTye,
      },
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: bookFormat,
      },
    );

    // create book in db
    const newBook = await Book.create({
      title,
      description,
      genre,
      auther: req.userId,
      coverImage: coverImageUploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    // delete local file
    await fs.unlink(coverImageFilePath);
    await fs.unlink(bookFilePath);

    res.json({ message: "success", data: newBook });
  } catch (err: any) {
    console.log(err);
    return next(createHttpError(500, "Error in uploading, try again"));
  }
};

export { createBook };
