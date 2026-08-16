import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect } from "../../../middlewares/authMiddleware.js";
import { admin } from "../../../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createCategory);
router.get("/", getCategories);
router.put("/:id", protect, admin, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

export default router;