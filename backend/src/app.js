import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/user.js";
import productRoutes from "../routes/product.js";
import cartRoutes from "../routes/cart.js";
import errorHandler from "../middleware/error.js";
import startServer from "./server.js";
import { logger } from "../middleware/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logger
app.use(logger);

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);

//Error Handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running" });
});

const PORT = process.env.PORT;

startServer(app, PORT);

export default app;
