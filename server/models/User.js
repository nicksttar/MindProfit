const mongoose = require("mongoose");
const crypto = require('crypto');

// --- Схема для хранения зашифрованных ключей ---
const exchangeApiSchema = new mongoose.Schema({
    exchangeName: { type: String, required: true, enum: ['binance', 'okx'] }, // Название биржи
    apiKey: { type: String, required: true },
    apiSecret: { type: String, required: true },
    // Passphrase нужен только для OKX, поэтому он не обязателен
    apiPassphrase: { type: String }, 
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // В реальном проекте пароль нужно хэшировать (bcrypt)
    
    // Массив для хранения подключенных бирж
    exchanges: [exchangeApiSchema],

    // Ссылка на все портфели этого пользователя
    // Мы будем хранить портфели в отдельной коллекции, но связывать их с пользователем
    portfolios: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Portfolio'
    }]
});

module.exports = mongoose.model("User", userSchema);
