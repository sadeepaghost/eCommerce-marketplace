import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {protect} from "../../../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getProducts);
router.get("/:id", getProductById);

// PRIVATE (LOGIN REQUIRED)
router.post("/", protect, createProduct);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
