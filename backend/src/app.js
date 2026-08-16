import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
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
import userRoutes from "./modules/users/routes/userRoutes.js";
import addressRoutes from "./modules/address/routes/addressRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/users", userRoutes);
app.use("/api/address", addressRoutes);

app.get("/", (req, res) => {
  res.send("Marketplace API Running");
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.status || 500).json({
    message: error.message || "Internal server error",
  });
});

export default app;