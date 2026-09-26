import "dotenv/config";
import express from "express";
import cors from "cors";
import { userRoutes } from "./routes/userRoutes.js";
import { itemRoutes } from "./routes/itemRoutes.js";

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

app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((err) => err.message);
    return res.status(400).json({ error: messages });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: `${field} already in use.` });
  }
  next(err);
});

export { app };
