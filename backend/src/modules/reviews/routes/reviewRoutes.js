import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";

import { protect } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/product/:productId", getProductReviews);
router.put("/:id", protect, updateReview);
router.delete("/:id", protect, deleteReview);

export default router;