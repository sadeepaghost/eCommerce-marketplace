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
// REMOVE ITEM FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    await cartItem.deleteOne();

    return res.status(200).json({
      message: "Item removed from cart",
    });
  } catch (error) {
    console.error("Remove cart item error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE CART ITEM QUANTITY
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.id;

    const parsedQuantity = Number(quantity);

    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({
        message: "Quantity must be a whole number greater than 0",
      });
    }

    const cartItem = await Cart.findOne({
      _id: cartItemId,
      userId: req.user.id,
    });

    if (!cartItem) {
      return res.status(404).json({
        message: "Cart item not found",
      });
    }

    const product = await Product.findById(cartItem.productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (parsedQuantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} item(s) available`,
      });
    }

    cartItem.quantity = parsedQuantity;
    await cartItem.save();

    const updatedCartItem = await Cart.findById(cartItem._id).populate(
      "productId"
    );

    return res.status(200).json({
      message: "Cart quantity updated",
      cartItem: updatedCartItem,
    });
  } catch (error) {
    console.error("Update cart error:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};