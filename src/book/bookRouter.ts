import { Router } from "express";
import { createBook } from "./bookController.ts";
import multer from "multer";
import path from "node:path";

const bookRouter = Router();

// file store locally
const upload = multer({
  dest: path.join(process.cwd(), "public", "data", "uploads"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// create book route
bookRouter.post(
  "/",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bookFile", maxCount: 1 },
  ]),
  createBook,
);

export default bookRouter;
