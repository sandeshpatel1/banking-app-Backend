const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // Import DB connection function

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL || "http://localhost:3000", // Use Render frontend URL in production
  })
);
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB Atlas
connectDB()
  .then(() => console.log("✅ MongoDB Atlas connected!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Root route for checking server status
app.get("/", (req, res) => {
  res.send("🚀 Banker API is Running!");
});

// Import routes
const accountRoutes = require("./routes/transactionRoutes");
const bankerRoutes = require("./routes/bankerRoutes");
const authRoutes = require("./routes/authRoutes");

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api", bankerRoutes);

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
