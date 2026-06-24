import express from "express";
import { protect } from "../../../middlewares/authMiddleware.js";
import { createPaymentIntent } from "../controllers/paymentController.js";
const router = express.Router();

router.post(
  "/create-payment-intent",
  protect,
  createPaymentIntent
);
export default router;