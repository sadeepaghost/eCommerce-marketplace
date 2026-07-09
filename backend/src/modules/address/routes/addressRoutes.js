import express from "express";
import { protect } from "../../../middlewares/authMiddleware.js";
import { createAddress, getAddresses, updateAddress, deleteAddress } from "../controllers/addressController.js";

const router = express.Router();

router.post("/", protect, createAddress);
router.get("/", protect, getAddresses);
router.put("/:id", protect, updateAddress);
router.delete("/:id", protect, deleteAddress);

export default router;