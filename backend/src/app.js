import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/carts", cartRoutes);  
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Marketplace API Running");
});

export default app;