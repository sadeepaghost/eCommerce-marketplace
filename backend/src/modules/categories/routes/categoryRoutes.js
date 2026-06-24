import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import { protect } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createCategory);
router.get("/", getCategories);
router.put("/:id", protect, updateCategory);
router.delete("/:id", protect, deleteCategory);

export default router;