import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler.js";
import { userRoutes } from "./routes/userRoutes.js";
import { itemRoutes } from "./routes/itemRoutes.js";
import { loadoutRoutes } from "./routes/loadoutRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  return res.send({ hello: "World" });
});

app.get("/health", (req, res) => {
  return res.status(200).json({ status: "ok" });
});

app.use("/api/users", userRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/loadouts", loadoutRoutes);

app.use(errorHandler);

export { app };
