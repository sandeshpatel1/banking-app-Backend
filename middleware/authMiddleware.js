const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res.status(400).json({ message: "Invalid token" });
  }
};

// Middleware for banker authorization
const bankerMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== "banker") {
    return res.status(403).json({ message: "Access restricted to bankers only" });
  }
  next();
};

module.exports = { authMiddleware, bankerMiddleware };
