const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  // 👇 НОВОЕ ПОЛЕ ДЛЯ СВЯЗИ С ПОЛЬЗОВАТЕЛЕМ 👇
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: String,
  months: Number,
  amount: Number,
  investedAt: Date,
  status: String,
  coins: [
    {
      symbol: String,
      quantity: Number,
      avgPurchasePrice: Number,
    },
  ],
});

module.exports = mongoose.model("Portfolio", portfolioSchema);
