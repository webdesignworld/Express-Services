const jwt = require("jsonwebtoken");
require("dotenv").config();

const requireCoder = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: "No token provided, authorization denied" });
  }

  // The header format should be: "Bearer <token>"
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ error: "Token missing, authorization denied" });
  }

  try {
    // Verify the token using the secret When signing a token
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    req.user = decoded.user; // This will set req.user with user id and role

    // Check if the user has the required role (e.g., "coder")
    if (req.user.role !== "coder") {
      return res
        .status(403)
        .json({ error: "Only coders can access this resource." });
    }
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Token is not valid" });
  }
};

module.exports = requireCoder;
