const Account = require("../models/Account");
const User = require("../models/User");

// Withdraw Money
const withdraw = async (req, res) => {
    try {
        const userId = req.user.userId;
        const amount = Number(req.body.amount);

        if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "Invalid amount." });

        const account = await Account.findOne({ user: userId });
        if (!account) return res.status(404).json({ message: "Account not found." });

        if (account.balance < amount) return res.status(400).json({ message: "Insufficient funds." });

        account.balance -= amount;
        account.transactions.push({ type: "withdraw", amount, date: new Date() });

        await account.save();
        res.status(200).json({ message: "Withdrawal successful.", newBalance: account.balance });
    } catch (error) {
        console.error("Withdraw Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// Deposit Money
const deposit = async (req, res) => {
    try {
        const userId = req.user.userId;
        const amount = Number(req.body.amount);

        if (isNaN(amount) || amount <= 0) return res.status(400).json({ message: "Invalid amount." });

        let account = await Account.findOne({ user: userId });
        if (!account) return res.status(404).json({ message: "Account not found." });

        account.balance += amount;
        account.transactions.push({ type: "deposit", amount, date: new Date() });

        await account.save();
        res.status(200).json({ message: "Deposit successful.", balance: account.balance });
    } catch (error) {
        console.error("Deposit Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// Transfer Money
const transfer = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const { recipientEmail, amount } = req.body;
        const transferAmount = Number(amount);

        if (!recipientEmail || isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({ message: "Invalid recipient email or amount." });
        }

        const senderAccount = await Account.findOne({ user: senderId });
        if (!senderAccount) return res.status(404).json({ message: "Sender account not found." });

        if (senderAccount.balance < transferAmount) return res.status(400).json({ message: "Insufficient funds." });

        const recipient = await User.findOne({ email: recipientEmail });
        if (!recipient) return res.status(404).json({ message: "Recipient not found." });

        const recipientAccount = await Account.findOne({ user: recipient._id });
        if (!recipientAccount) return res.status(404).json({ message: "Recipient account not found." });

        senderAccount.balance -= transferAmount;
        recipientAccount.balance += transferAmount;

        const transactionDate = new Date();
        senderAccount.transactions.push({ type: "transfer", amount: transferAmount, to: recipientEmail, date: transactionDate });
        recipientAccount.transactions.push({ type: "transfer", amount: transferAmount, from: req.user.email, date: transactionDate });

        await senderAccount.save();
        await recipientAccount.save();

        res.status(200).json({ message: "Transfer successful." });
    } catch (error) {
        console.error("Transfer Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get Transaction History
const getTransactionHistory = async (req, res) => {
    try {
        const userId = req.user.userId;
        const account = await Account.findOne({ user: userId });

        if (!account) return res.status(404).json({ message: "Account not found." });

        const sortedTransactions = account.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.status(200).json({ transactions: sortedTransactions });
    } catch (error) {
        console.error("Transaction History Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};

// Get Balance
const getBalance = async (req, res) => {
    try {
        const userId = req.user.userId;
        const account = await Account.findOne({ user: userId });

        if (!account) return res.status(404).json({ message: "Account not found." });

        res.status(200).json({ balance: account.balance });
    } catch (error) {
        console.error("Get Balance Error:", error);
        res.status(500).json({ message: "Server Error", error });
    }
};



module.exports = { withdraw, deposit, transfer, getTransactionHistory, getBalance  };
