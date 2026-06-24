import express from "express";

import {
  getUsers,
  getProducts,
  getOrders,
  getDashboardStats,
} from "../controllers/adminController.js";

import { protect } from "../../../middlewares/authMiddleware.js";
import { admin } from "../../../middlewares/adminMiddleware.js";

const router = express.Router();

router.get("/users", protect, admin, getUsers);
router.get("/products", protect, admin, getProducts);
router.get("/orders", protect, admin, getOrders);
router.get("/stats", protect, admin, getDashboardStats);

export default router;