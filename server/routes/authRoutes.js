// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const verifyUser = require("../middleware/auth");
require("dotenv").config();

// Register
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields required" });

    // check duplicate
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: "User already exists" });

    // hash password
    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hash,
      address,
      role: role || "USER", // default normal user
    });

    res.json({ message: "Registered successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Token create
    const token = jwt.sign(
      { id: user.id, role: user.role},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Cookie set
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict",
    });

    res.json({ msg: "Login success", token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Me
router.get("/me", verifyUser, async (req, res, next) => {
  try {
    const me = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "address", "role"],
    });
    res.json(me);
  } catch (err) {
    next(err);
  }
});

// Update profile (name, address)
router.put("/profile", verifyUser, async (req, res, next) => {
  try {
    const { name, address } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name !== undefined) user.name = name;
    if (address !== undefined) user.address = address;

    await user.save();
    res.json({
      message: "Profile updated",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Update password
router.put("/update-password", verifyUser, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match)
      return res.status(400).json({ message: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
});

// Logout
router.post("/logout", verifyUser, (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

module.exports = router;
