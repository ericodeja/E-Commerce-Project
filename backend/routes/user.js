import express from "express";
import protect from "../middleware/auth.js";
import { readFile, writeFile } from "../utils/fileServices.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, "../data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

const router = express.Router();

router.use(protect);
router.get("/me", async (req, res) => {
  const allUsers = await readFile(USERS_FILE);

  const payload = req.user;
  const user = allUsers.find((u) => u.id === payload.userId);
  res.status(201).json({
    success: true,
    data: {
      user,
    },
  });
});

export default router;
