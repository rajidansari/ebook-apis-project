import { Router } from "express";
import { createBook } from "./bookController.ts";

const bookRouter = Router();

bookRouter.post("/", createBook);

export default bookRouter;
