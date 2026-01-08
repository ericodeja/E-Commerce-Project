import express from "express";
import protect from "../middleware/auth.js";
import userControllers from "../controllers/userControllers.js";

const router = express.Router();

//Middleware
router.use(protect);

router.get("/users", userControllers.getUser);
router.get("/:id", userControllers.getUser);
export default router;
