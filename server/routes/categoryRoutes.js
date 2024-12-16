import express from "express";
import { authentication, authorizeAdmin } from "../utils/protectRoute.js";
import {
  createCategory,
  deleteCategory,
  getCategoryById,
  getListCategory,
  updateCategory,
} from "../controllers/categoryControllers.js";

const router = express.Router();
router.route("/").post(authentication, authorizeAdmin, createCategory);
router.route("/categories").get(getListCategory);
router
  .route("/:categoryId")
  .put(authentication, authorizeAdmin, updateCategory)
  .delete(authentication, authorizeAdmin, deleteCategory)
  .get(getCategoryById);
// router.get("/:id", getCategoryById);

export default router;
