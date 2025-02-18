const jwt = require("jsonwebtoken");
require("dotenv").config();

const payload = {
  id: "67adb1aa43945faa5052eb63",
  email: "manager@example.com",
  role: "manager",
};

const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "2h" });
console.log("Generated Token:", token);
