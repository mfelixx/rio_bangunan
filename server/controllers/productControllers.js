import asyncHandler from "../utils/asyncHandler.js";
import Product from "../models/productModels.js";

export const addProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock,
    } = req.fields;

    switch (true) {
      case !name:
        return res.status(400).json({ error: "Product name is required" });
      case !description:
        return res
          .status(400)
          .json({ error: "Product description is required" });
      case !price:
        return res.status(400).json({ error: "Product price is required" });
      case !category:
        return res.status(400).json({ error: "Product category is required" });
      case !quantity:
        return res.status(400).json({ error: "Product quantity is required" });
      case !brand:
        return res.status(400).json({ error: "Product brand is required" });
      case !countInStock:
        return res
          .status(400)
          .json({ error: "Product countInStock is required" });

      default:
        const newProduct = new Product({ ...req.fields });
        await newProduct.save();
        res.status(200).json({ msg: "Success to add product" });
        break;
    }
  } catch (error) {
    res.status(400).json({ error: "Failed to add product" });
  }
});

export const updateDetailsProduct = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      quantity,
      brand,
      countInStock,
    } = req.fields;

    switch (true) {
      case !name:
        return res.status(400).json({ error: "Product name is required" });
      case !description:
        return res
          .status(400)
          .json({ error: "Product description is required" });
      case !price:
        return res.status(400).json({ error: "Product price is required" });
      case !category:
        return res.status(400).json({ error: "Product category is required" });
      case !quantity:
        return res.status(400).json({ error: "Product quantity is required" });
      case !brand:
        return res.status(400).json({ error: "Product brand is required" });
      case !countInStock:
        return res
          .status(400)
          .json({ error: "Product countInStock is required" });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.fields },
      { new: true }
    );
    res.status(200).json({ msg: "Success to update product " });
  } catch (error) {
    res.status(400).json({ error: "Failed to update product" });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    await product.deleteOne({ _id: req.params.id });
    res
      .status(200)
      .json({ msg: `Success to delete product : ${product.name}` });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete product" });
  }
});

export const getProducts = asyncHandler(async (req, res) => {
  try {
    const pageSize = 6;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};
    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword }).limit(pageSize);

    res
      .status(200)
      .json({ products, page: Math.ceil(count / pageSize), hasMore: false });
  } catch (error) {
    res.status(400).json({ error: "Failed to get products" });
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to get product" });
  }
});

export const getAllProduct = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: "Failed to get all product" });
  }
});

export const addProductReview = asyncHandler(async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        res.status(400).json({ error: "Product already reviewed" });
        return;
      }

      const review = {
        name: req.user.username,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(201).json({ msg: "Review added" });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add review" });
  }
});

export const getTopProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find({}).sort({ rating: -1 }).limit(4);
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: "Failed to get top products" });
  }
});

export const getNewProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: "Failed to get new products" });
  }
});

export const filterProducts = asyncHandler(async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await Product.find(args);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ error: "Failed to filter products" });
  }
});
