import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  register,
  login,
  verifyEmail,
  saveLoadout,
  unsaveLoadout,
} from "../controllers/userController.js";

const userRoutes = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
userRoutes.post("/verify", verifyEmail);
userRoutes.post("/savedLoadouts/save", authMiddleware, saveLoadout);
userRoutes.delete("/savedLoadouts/unsave/:id", authMiddleware, unsaveLoadout);

export { userRoutes };
