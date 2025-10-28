import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import fs from "node:fs/promises";
import Book from "./bookModel.ts";
import type { AuthRequest } from "../middlewares/authenticate.ts";
import coverImageInfo from "../utils/coverImageInfo.ts";
import bookFileInfo from "../utils/bookFileInfo.ts";
import cloudinaryFileUploader from "../utils/cloudinaryFileUploader.ts";

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
    const coverImageUploadResult = await cloudinaryFileUploader(
      coverImageFilePath,
      "image",
      coverImageFileName,
      "book-cover-images",
      coverImageMimeTye,
    );

    const bookFileUploadResult = await cloudinaryFileUploader(
      bookFilePath,
      "raw",
      bookFileName,
      "book-pdfs",
      bookFormat,
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

const updateBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const { title, description, genre } = req.body;
  const bookId = req.params.bookId;

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  try {
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    if (book?.auther.toString() !== req.userId) {
      return next(createHttpError(403, "You cannot update ebook info"));
    }

    let completeCoverImg = "";

    // check if coverImage field is exist.
    if (files?.coverImage) {
      const { coverImageFileName, coverImageFilePath, coverImageMimeTye } =
        coverImageInfo(files);

      const coverImgUploadResult = await cloudinaryFileUploader(
        coverImageFilePath,
        "image",
        coverImageFileName,
        "book-cover-images",
        coverImageMimeTye,
      );

      completeCoverImg = coverImgUploadResult.secure_url;
      await fs.unlink(coverImageFilePath);
    }

    // check if bookFile field is exist.
    let completeBookFile = "";

    if (files?.bookFile) {
      const { bookFileName, bookFilePath, bookFormat } = bookFileInfo(files);

      const bookFileUploadResult = await cloudinaryFileUploader(
        bookFilePath,
        "raw",
        bookFileName,
        "book-pdfs",
        bookFormat,
      );

      completeBookFile = bookFileUploadResult.secure_url;
      await fs.unlink(bookFilePath);
    }

    const updatedBook = await Book.findOneAndUpdate(
      { _id: bookId },
      {
        title,
        genre,
        description,
        coverImage: completeCoverImg ? completeCoverImg : book.coverImage,
        file: completeBookFile ? completeBookFile : book.file,
      },
      { new: true },
    );

    res.status(200).json({ message: "success", data: updatedBook });
  } catch (err) {
    return next(
      createHttpError(
        500,
        "Server can't be able to process your request, try again after a while.",
      ),
    );
  }
};

const listAllBooks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.log("entered...");
    // add pagination
    const books = await Book.find();

    res.status(200).json({ message: "success", books });
  } catch (err) {
    return next(createHttpError(500, "Books fetching failed, try again"));
  }
};

const listSingleBook = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const bookId = req.params.bookId;

  try {
    const book = await Book.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    res.status(200).json({ message: "success", book });
  } catch (err) {
    return next(
      createHttpError(500, "Not able to fetch this book, try again."),
    );
  }
};

export { createBook, updateBook, listAllBooks, listSingleBook };
