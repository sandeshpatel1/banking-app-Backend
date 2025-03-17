const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    balance: { type: Number, required: true, default: 0 },
    transactions: [
        {
            type: {
                type: String,
                enum: ["deposit", "withdraw", "transfer"], 
                required: true,
            },
            amount: { type: Number, required: true },
            date: { type: Date, default: Date.now },
        },
    ],
});

const Account = mongoose.model("Account", accountSchema);
module.exports = Account;
