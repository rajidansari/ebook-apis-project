import { Router } from "express";
import { createUser } from "./userController.ts";

const userRouter = Router();

userRouter.post("/register", createUser);

export default userRouter;
