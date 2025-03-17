const User = require("../models/User");
const Account = require("../models/Account");

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

const getAllAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().populate("user", "name email");
        res.status(200).json({ accounts });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};


const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};

module.exports = { getAllUsers, getAllAccounts, getUserById };
