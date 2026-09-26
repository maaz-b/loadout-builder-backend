import { Router } from "express";
import {
  getAllItems,
  getItem,
  editItem,
  createItem,
  deleteItem,
} from "../controllers/itemController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const itemRoutes = Router();

itemRoutes.use(authMiddleware);

itemRoutes.get("/", getAllItems);
itemRoutes.get("/:id", getItem);
itemRoutes.post("/", createItem);
itemRoutes.put("/:id", editItem);
itemRoutes.delete("/:id", deleteItem);

export { itemRoutes };
