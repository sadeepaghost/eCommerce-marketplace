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
import sendEmail from "./utils/sendEmail.js";
import userRoutes from "./modules/users/routes/userRoutes.js";
import addressRoutes from "./modules/address/routes/addressRoutes.js";

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/users", userRoutes);
app.use("/api/address", addressRoutes);
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

app.get("/test-email", async (req, res) => {
  try {
    await sendEmail(
      "sadeepaamaranayake@gmail.com",
      "Test Email",
      "Email service is working"
    );

    res.send("Email sent successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
});
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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));