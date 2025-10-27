import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.ts";
import userRouter from "./user/userRouter.ts";
import bookRouter from "./book/bookRouter.ts";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ebook apis" });
});

app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

app.use(globalErrorHandler);

export default app;
