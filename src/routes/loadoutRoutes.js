import { Router } from "express";
import {
  getAll,
  getOne,
  createLoadout,
  editLoadout,
  deleteOne,
  likeLoadout,
  getPopular,
} from "../controllers/loadoutController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const loadoutRoutes = Router();

loadoutRoutes.use(authMiddleware);

loadoutRoutes.get("/", getAll);
loadoutRoutes.get("/popular", getPopular);
loadoutRoutes.get("/:id", getOne);
loadoutRoutes.post("/", createLoadout);
loadoutRoutes.put("/:id", editLoadout);
loadoutRoutes.delete("/:id", deleteOne);
loadoutRoutes.put("/like/:id", likeLoadout);

export { loadoutRoutes };
