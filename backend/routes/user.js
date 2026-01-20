import express from "express";
import { authenticate } from "../middleware/auth.js";
import userControllers from "../controllers/userControllers.js";
import { authorizePermissions } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/users",
  authenticate,
  authorizePermissions("user:read_all"),
  userControllers.getUser,
);
router.get(
  "/:id",
  authenticate,
  authorizePermissions("user:read_one"),
  userControllers.getUser,
);

router.put(
  "/:id",
  authenticate,
  authorizePermissions("user:update_any"),
  userControllers.updateUser,
);

router.delete(
  "/:id",
  authenticate,
  authorizePermissions("user:delete_any"),
  userControllers.deleteUser,
);

export default router;
