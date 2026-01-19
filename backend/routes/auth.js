import express from "express";
import { authenticate } from "../middleware/auth.js";
import authControllers from "../controllers/authControllers.js";

const router = express.Router();

//Middleware
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

//Routes
router.post("/signup", authControllers.signup);

router.post("/login", authControllers.login);

router.post("/logout", authenticate, authControllers.logout);

router.post("/refresh", authControllers.refresh);

router.post("/forgot-password", authControllers.forgotPassword);

router.post("/reset-password", authControllers.resetPassword);

router.get("/me", authControllers.getUser);

router.put("/me", authenticate, authControllers.updateUser);

export default router;
