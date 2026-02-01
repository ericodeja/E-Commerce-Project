import express from "express";
import multer from "multer";
import { authenticate, authorizePermissions } from "../middleware/auth.js";
import productControllers from "../controllers/productController.js";
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
  productControllers.createProduct,
);
router.get(
  "/",
  authenticate,
  authorizePermissions("product:read"),
  productControllers.getProduct,
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("product:read"),
  productControllers.getProductById,
);

router.put(
  "/:id",
  authenticate,
  authorizePermissions("product:update"),
  productControllers.updateProduct,
);

router.delete(
  "/:id",
  authenticate,
  authorizePermissions("product:delete"),
  productControllers.deleteProduct,
);

export default router;
