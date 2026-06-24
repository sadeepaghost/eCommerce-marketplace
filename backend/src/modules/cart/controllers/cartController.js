import Cart from "../models/cartModel.js";
import Product from "../../auth/models/product.js";

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const existingCartItem = await Cart.findOne({
      userId: req.user.id,
      productId,
    });

    if (existingCartItem) {
      existingCartItem.quantity += quantity || 1;
      await existingCartItem.save();

      return res.json(existingCartItem);
    }

    const cartItem = await Cart.create({
      userId: req.user.id,
      productId,
      quantity: quantity || 1,
    });

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({
      userId: req.user.id,
    }).populate("productId");

    res.json(cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REMOVE ITEM FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    await cartItem.deleteOne();

    res.json({
      message: "Item removed from cart",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};