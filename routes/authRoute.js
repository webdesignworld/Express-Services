const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");

router.post("/register", async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      avatar,
      role,
      description,
    } = req.body;
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      avatar,
      role: role || "coder",
      description,
      totalScore: 0,
    });
    const savedUser = await newUser.save();
    res.status(201).json({ user: savedUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
