import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/user.js";
import path from "path";
import { fileURLToPath } from "url";
import errorHandler from "../middleware/error.js";
import startServer from "./server.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

//Error Handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running" });
});

const PORT = process.env.PORT || 5000;

startServer(app, PORT);

export default app;
