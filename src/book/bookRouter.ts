import { Router } from "express";
import {
  createBook,
  listAllBooks,
  listSingleBook,
  updateBook,
} from "./bookController.ts";
import multer from "multer";
import path from "node:path";
import authenticate from "../middlewares/authenticate.ts";

const bookRouter = Router();

// file store locally
const upload = multer({
  dest: path.join(process.cwd(), "public", "data", "uploads"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// create book route
bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  createBook,
);

// update book route
bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  updateBook,
);

// get all books
bookRouter.get("/", listAllBooks);

// get a single book
bookRouter.get("/:bookId", listSingleBook);

export default bookRouter;
