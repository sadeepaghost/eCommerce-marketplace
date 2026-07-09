import Order from "../models/orderModel.js";
import Cart from "../../cart/models/cartModel.js";

export const createOrder = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.user.id,
    }).populate("productId");

    for (const item of cartItems) {
      if (item.productId.stock < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${item.productId.name}`,
        });
      }
    } 

    if (cartItems.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    const orderItems = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));

    const totalPrice = cartItems.reduce(
      (total, item) =>
        total + item.productId.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId: req.user.id,
      orderItems,
      totalPrice,
    });

    for (const item of cartItems) {
      item.productId.stock -= item.quantity;
      await item.productId.save();
    }


    await Cart.deleteMany({
      userId: req.user.id,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.user.id,
    }).populate("orderItems.productId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = req.body.status;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const markOrderPaid = async (req, res) => {
  try {
    const order = await Order.findById(
      req.params.id
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status = "Paid";

    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};