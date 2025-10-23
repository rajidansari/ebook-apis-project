import express from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler.ts";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Welcome to ebook apis" });
});

app.use(globalErrorHandler);

export default app;
