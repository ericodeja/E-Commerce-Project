import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "../routes/auth.js";
import userRoutes from "../routes/user.js";
import errorHandler from "../middleware/error.js";
import startServer from "./server.js";


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

const PORT = process.env.PORT;

startServer(app, PORT);

export default app;
