import express from "express";

import authRoutes from "../modules/auth/routes/authRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);

export default router;