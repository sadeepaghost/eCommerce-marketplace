import express from "express";
import { protect } from "../../../middlewares/authMiddleware.js";
import { createAddress, getAddresses } from "../controllers/addressController.js";

const router = express.Router();

router.post("/", protect, createAddress);
router.get("/", protect, getAddresses);

export default router;