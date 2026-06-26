import express from "express";
import { protect } from "../../../middlewares/authMiddleware.js";

import {
  createOrder,
  getMyOrders,
  updateOrderStatus,
  markOrderPaid,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/my", protect, getMyOrders);

router.put("/:id/status", protect, updateOrderStatus);

router.put("/:id/pay", protect, markOrderPaid);

export default router;