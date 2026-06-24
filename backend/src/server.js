import dotenv from "dotenv";
dotenv.config();
import express from "express";

import connectDB from "./config/db.js";
import authRoutes from "./modules/auth/routes/authRoutes.js";
import productRoutes from "./modules/auth/routes/productRoutes.js";
import cartRoutes from "./modules/cart/routes/cartRoutes.js";
import orderRoutes from "./modules/orders/routes/orderRoutes.js";
import wishlistRoutes from "./modules/wishlist/routes/wishlistRoutes.js";
import reviewRoutes from "./modules/reviews/routes/reviewRoutes.js";
import categoryRoutes from "./modules/categories/routes/categoryRoutes.js";
import adminRoutes from "./modules/admin/routes/adminRoutes.js";
import uploadRoutes from "./modules/products/routes/uploadRoutes.js";
import paymentRoutes from "./modules/payments/routes/paymentRoutes.js";
import couponRoutes from "./modules/coupons/routes/couponRoutes.js";


const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();