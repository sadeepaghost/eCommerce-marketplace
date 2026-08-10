import Product from "../models/Product.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      image,
      stock,
      brand,
      isFeatured,
    } = req.body;

    if (!name || price === undefined || !description || stock === undefined) {
      return res.status(400).json({
        message: "Name, price, description and stock are required",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      price: Number(price),
      description: description.trim(),
      category: category?.trim() || "general",
      image: image?.trim() || "",
      stock: Number(stock),
      brand: brand?.trim() || "Generic",
      isFeatured: Boolean(isFeatured),
      userId: req.user.id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    const category = req.query.category
      ? {
          category: req.query.category,
        }
      : {};

    let sortOption = {};

    if (req.query.sort === "price") {
      sortOption.price = 1;
    }

    if (req.query.sort === "-price") {
      sortOption.price = -1;
    }

    if (req.query.sort === "latest") {
      sortOption.createdAt = -1;
    }

    const query = {
      ...keyword,
      ...category,
    };

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("userId", "name email")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "price",
      "description",
      "category",
      "image",
      "stock",
      "brand",
      "isFeatured",
    ];

    const updates = Object.fromEntries(
      allowedFields
        .filter((field) => req.body[field] !== undefined)
        .map((field) => [field, req.body[field]])
    );

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.stock = req.body.stock;

    await product.save();

    res.json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getLowStockProducts = async (req, res) => {
  try {
    const products = await Product.find({
      stock: { $lt: 10 },
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};