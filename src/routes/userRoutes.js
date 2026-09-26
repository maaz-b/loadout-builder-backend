import { Router } from "express";
import { register, login, verifyEmail } from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/verify", verifyEmail);

export { userRoutes };
