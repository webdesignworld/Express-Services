const jwt = require("jsonwebtoken");

function authorize(roles = []) {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. Malformed authorization header." });
      }

      const token = authHeader.split(" ")[1];


      const decoded = jwt.verify(token, process.env.JWT_TOKEN);
      req.user = { id: decoded.id, email: decoded.email, role: decoded.role };


      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied. Role not authorized." });
      }


      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token", error: error.message });
    }
  };
}

module.exports = authorize;