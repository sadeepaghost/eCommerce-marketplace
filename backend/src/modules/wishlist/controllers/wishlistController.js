import Wishlist from "../models/wishlistModel.js";
import Product from "../../auth/models/product.js";

// ADD TO WISHLIST
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const exists = await Wishlist.findOne({
      userId: req.user.id,
      productId,
    });

    if (exists) {
      return res.status(400).json({
        message: "Already in wishlist",
      });
    }

    const item = await Wishlist.create({
      userId: req.user.id,
      productId,
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET WISHLIST
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      userId: req.user.id,
    }).populate("productId");

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REMOVE FROM WISHLIST
export const removeFromWishlist = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    await item.deleteOne();

    res.json({
      message: "Removed from wishlist",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};