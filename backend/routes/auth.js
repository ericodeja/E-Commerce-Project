import express from "express";
import protect from "../middleware/auth.js";
import authControllers from "../controllers/authControllers.js";

const router = express.Router();

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Routes
router.post("/signup", authControllers.signup);

router.post("/login", authControllers.login);

router.post("/logout", protect, authControllers.logout);

router.post("/refresh", authControllers.refresh);

export default router;
