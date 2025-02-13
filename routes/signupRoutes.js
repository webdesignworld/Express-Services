const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/userSchema");

const router = express.Router();

// Hash the password
async function createPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Create a verification token
function createVerificationToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_TOKEN, {
    expiresIn: "3h",
  });
}

// Send verification email
async function sendVerificationEmail(user, token) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const url = `http://localhost:3000/auth/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Verify Your Email",
    html: `<p>Click <a href="${url}">here</a> to verify your account.</p>`,
  });
}

// Signup endpoint
router.post("/signup", async (req, res) => {
  try {
    const { first_name, last_name, email, password, avatar, role, description } = req.body;


    console.log("Request Body:", req.body);
    
    // Check for required fields
    if (!first_name || !last_name || !email || !password || !avatar || !role || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await createPassword(password);

    // Create a new user using the provided fields
    const newUser = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      avatar,
      role,
      description,
      isVerified: false, // assuming your schema includes this field
      score: 0,          // default score
    });

    // Create a verification token and send a verification email
    const token = createVerificationToken(newUser);
    await sendVerificationEmail(newUser, token);

    res.status(201).json({ message: "Registration successful. Please verify your email." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
});

module.exports = router;
