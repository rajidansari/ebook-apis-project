import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import fs from "node:fs/promises";
import Book from "./bookModel.ts";
import type { AuthRequest } from "../middlewares/authenticate.ts";
import coverImageInfo from "../utils/coverImageInfo.ts";
import bookFileInfo from "../utils/bookFileInfo.ts";
import cloudinaryFileUploader from "../utils/cloudinaryFileUploader.ts";
import cloudinary from "../config/cloudinary.ts";

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

      // todo: delete the old cover image on cloudinary

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

      // todo: delete the old book file from cloudinary

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

// console.log(`${splittedArr.at(-2)}/${splittedArr.at(-1).split(".")[0]}`)
const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const bookId = req.params.bookId;
  try {
    const book = await Book.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // check authorization
    const _req = req as AuthRequest;

    if (book.auther.toString() !== _req.userId) {
      return next(
        createHttpError(403, "You are not authorize to delete this book."),
      );
    }

    // cover img cloudinary's publicId
    const coverImgUrlArray = book.coverImage.split("/");
    const coverImgPublicId =
      coverImgUrlArray.at(-2) + "/" + coverImgUrlArray.at(-1)?.split(".")[0];

    // book file cloudinary's publicId
    const bookFileUrlArray = book.file.split("/");
    const bookFilePublicId =
      bookFileUrlArray.at(-2) + "/" + bookFileUrlArray.at(-1);

    // delete coverImage & bookFile from cloudinary
    await cloudinary.uploader.destroy(coverImgPublicId);
    await cloudinary.uploader.destroy(bookFilePublicId, {
      resource_type: "raw",
    });

    //delete from db
    await Book.deleteOne({ _id: bookId });

    res.sendStatus(204);
  } catch (error) {
    return next(createHttpError(500, "Request timeout, try again."));
  }
};

export { createBook, updateBook, listAllBooks, listSingleBook, deleteBook };
