import express from "express";
import {
  regisUser,
  loginUser,
  logoutUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} from "../controllers/authControllers.js";

import { authentication, authorizeAdmin } from "../utils/protectRoute.js";

const router = express.Router();
router
  .route("/")
  .post(regisUser)
  .get(authentication, authorizeAdmin, getAllUsers);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router
  .route("/profile")
  .get(authentication, getCurrentUserProfile)
  .put(authentication, updateCurrentUserProfile);

// admin👇
router
  .route("/:id")
  .delete(authentication, authorizeAdmin, deleteUserById)
  .get(authentication, authorizeAdmin, getUserById)
  .put(authentication, authorizeAdmin, updateUserById);

export default router;
