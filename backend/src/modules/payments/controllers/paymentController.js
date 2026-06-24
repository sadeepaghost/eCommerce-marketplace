import stripe from "../../../config/stripe.js";
import Order from "../../orders/models/orderModel.js";

export const createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: order.totalPrice * 100,
        currency: "usd",
        metadata: {
          orderId: order._id.toString(),
        },
      });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};