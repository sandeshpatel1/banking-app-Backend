const User = require("../models/User");
const Account = require("../models/Account"); // Import Account Model
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            role: role || "customer", // Default role: "customer"
        });

        await user.save();

        // ✅ Create an account for the new user
        const account = new Account({
            user: user._id,
            balance: 500, // Default balance is 0
            transactions: [],
        });

        await account.save(); // Save account in DB

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(201).json({ 
            message: "User registered successfully", 
            token,  
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            account: { _id: account._id, balance: account.balance } // ✅ Return account details
        });

    } catch (error) {
        console.error("Error in registerUser:", error); // Log error
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        // 🔹 Fetch user's account
        const account = await Account.findOne({ userId: user._id });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
            accountId: account ? account._id : null  // Return account ID if exists
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { registerUser, login };
