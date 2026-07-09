import express from "express";
import { protect } from "../../../middlewares/authMiddleware.js";
import { getProfile, updateProfile, changePassword } from "../controllers/userController.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);

export default router;