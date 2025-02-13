const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");

const router = express.Router();

async function validatePassword(inputPassword, storedPassword) {
  return bcrypt.compare(inputPassword, storedPassword);
}

function createToken(user) {
  return jwt.sign({ user: { id: user._id, email: user.email, role: user.role } }, process.env.JWT_TOKEN, { expiresIn: "3h" });
}

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }

    const isValidPassword = await validatePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = createToken(user);
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
});

module.exports = router;
