import express from "express";
import {authenticate} from "../middleware/auth.js";
import ProductControllers from "../controllers/productController.js";

const router = express.Router();

router.use(authenticate);

router.post("/register", ProductControllers.createProduct);
router.get("/products", ProductControllers.getProduct);
router.get("/:id", ProductControllers.getProduct);

export default router;
