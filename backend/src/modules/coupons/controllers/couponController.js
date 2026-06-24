import Coupon from "../models/couponModel.js";

export const applyCoupon = async (req, res) => {
  try {
    const { code, totalPrice } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Invalid coupon",
      });
    }

    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({
        message: "Coupon expired",
      });
    }

    const discountAmount =
      (totalPrice * coupon.discount) / 100;

    const finalPrice =
      totalPrice - discountAmount;

    res.json({
      originalPrice: totalPrice,
      discount: coupon.discount,
      discountAmount,
      finalPrice,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
