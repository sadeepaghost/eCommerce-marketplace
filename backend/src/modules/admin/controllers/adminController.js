import User from "../../auth/models/userModel.js";
import Product from "../../auth/models/product.js";
import Order from "../../orders/models/orderModel.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ALL ORDERS
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const users = await User.countDocuments();
    const products = await Product.countDocuments();
    const orders = await Order.countDocuments();
    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const revenue =
      revenueData.length > 0
        ? revenueData[0].totalRevenue
        : 0;

    res.json({
      users,
      products,
      orders,
      revenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};