import express from "express";
import multer from "multer";
import { authenticate, authorizePermissions } from "../middleware/auth.js";
import ProductControllers from "../controllers/productController.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post(
  "/create",
  authenticate,
  authorizePermissions("product:create"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  uploadToCloudinary,
  ProductControllers.createProduct,
);
router.get(
  "/products",
  authenticate,
  authorizePermissions("product:read"),
  ProductControllers.getProduct,
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("product:read"),
  ProductControllers.getProduct,
);

export default router;
