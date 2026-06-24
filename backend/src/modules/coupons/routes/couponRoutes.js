import express from "express";
import { protect } from "../../../middlewares/authMiddleware.js";
import { applyCoupon } from "../controllers/couponController.js";

const router = express.Router();
router.post("/apply", protect, applyCoupon);
export default router;