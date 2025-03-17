const express = require("express");
const { getAllUsers, getAllAccounts } = require("../controllers/bankerController");
const { authMiddleware, bankerMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/banker/accounts", authMiddleware, bankerMiddleware, getAllAccounts);
router.get("/banker/user/:userId", authMiddleware, bankerMiddleware, getAllUsers);


module.exports = router;
