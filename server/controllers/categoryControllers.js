import Category from "../models/categoryModels.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.json({ error: "Category name is required" });
    const checkCategory = await Category.findOne({ name });
    if (checkCategory)
      return res
        .status(401)
        .json({ error: `${checkCategory.name} category already exists` });
    const newCategory = await new Category({ name }).save();
    res.status(200).json({ msg: "Success to create category" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Failed to create category" });
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;
    const category = await Category.findOne({ _id: categoryId });
    if (!category) return res.status(404).json({ error: "Category not found" });
    category.name = name;
    const updateCategory = await category.save();
    res.status(200).json({ msg: "Success to update category" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });
    await category.deleteOne();
    res
      .status(200)
      .json({ msg: `Success to delete ${category.name} category` });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to delete category" });
  }
});

export const getListCategory = asyncHandler(async (req, res) => {
  try {
    const listCategory = await Category.find({});
    res.status(200).json(listCategory);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ error: "Failed to get list category" });
  }
});

export const getCategoryById = asyncHandler(async (req, res) => {
  try {
    const { categoryId } = req.params;
    const category = await Category.findById({ _id: categoryId });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    return res.status(400).json({ error: "Failed to get category" });
  }
});
