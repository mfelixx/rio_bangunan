import User from "../models/userModels.js";
import asyncHandler from "../utils/asyncHandler.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";

export const regisUser = asyncHandler(async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const cekUser = await User.findOne({ email });
    if (cekUser) return res.status(500).json({ error: "User already exists" });
    if (username.length > 8 || password.length > 8) {
      return res
        .status(401)
        .json({ error: "Username or password is too long" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      passwordNoHash: password,
    });
    if (newUser) {
      generateToken(res, newUser._id);
      await newUser.save();
      res.status(200).json({
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  } catch (error) {
    res.status(500).json({ error: "Falled to registers" });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    const cekUser = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      cekUser?.password || ""
    );

    if (!cekUser || !isPasswordCorrect) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    generateToken(res, cekUser._id);
    res.status(200).json({
      _id: cekUser._id,
      username: cekUser.username,
      email: cekUser.email,
      isAdmin: cekUser.isAdmin,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to sign in" });
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ msg: "Success to logout" });
  } catch (error) {
    res.status(500).json({ error: "Failed to logout" });
  }
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

export const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (req.body.username.length > 8 || req.body.password.length > 8) {
    return res.status(401).json({ error: "Username or password is too long" });
  }
  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
      user.passwordNoHash = req.body.password;
    }

    const updateUser = await user.save();

    res.json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400).json({ error: "Cannot delete admin" });
    }
    await User.deleteOne({ _id: user._id });
    res.json({ msg: `Pengguna ${user.username} successfully deleted` });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

export const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin) || user.isAdmin;

    const updateUser = await user.save();
    res.json({
      _id: updateUser._id,
      username: updateUser.username,
      email: updateUser.email,
      isAdmin: updateUser.isAdmin,
    });
  }
});
