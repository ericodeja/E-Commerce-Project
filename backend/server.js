import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config();

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//Serve static files(frontened)
app.use(express.static(path.join(__dirname, "../frontend")));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "E-commerce API is running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
