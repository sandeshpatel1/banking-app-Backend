const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { getBalance, getTransactionHistory, withdraw, deposit, transfer } = require("../controllers/transactionController");

const router = express.Router();

// Routes
router.get("/balance", authMiddleware, getBalance); 
router.get("/transactions", authMiddleware, getTransactionHistory); 
router.post("/withdraw", authMiddleware, withdraw);
router.post("/deposit", authMiddleware, deposit);
router.post("/transfer", authMiddleware, transfer);

module.exports = router;
