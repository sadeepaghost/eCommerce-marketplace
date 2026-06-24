import express from "express";
import upload from "../../../middlewares/uploadMiddleware.js";
import {uploadImage} from "../controllers/uploadController.js";
import { protect } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.single("image"),
  uploadImage
);

export default router;