const jwt = require("jsonwebtoken");
require("dotenv").config();

const payload = {
  id: "d6799fa2ce00d521f47b10c39",
  email: "coder@example.com",
  role: "coder",
};

const token = jwt.sign(payload, process.env.JWT_TOKEN, { expiresIn: "2h" });
console.log("Generated Token:", token);
