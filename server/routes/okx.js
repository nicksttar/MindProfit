const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();
const Portfolio = require("../models/Portfolio"); 

// --- МАРШРУТЫ API ---

// 1. Подключение к OKX (проверка ключей)
// Используем ту же логику, что и в рабочем "простом" коде,
// но берем ключи из запроса.
router.post("/connect", async (req, res) => {
    console.log("\n--- ЗАПУСК РЕШАЮЩЕГО ТЕСТА ---");
    const { apiKey, apiSecret, apiPassphrase } = req.body;
    
    // Диагностика полученных ключей
    console.log(`Полученный apiKey: [${apiKey}]`);
    console.log(`Полученный apiSecret: [${apiSecret}]`);
    console.log(`Полученный apiPassphrase: [${apiPassphrase}]`);

    try {
        const timestamp = new Date().toISOString();
        const method = 'GET';
        const requestPath = '/api/v5/account/balance';
        const prehash = timestamp + method + requestPath;

        console.log("Строка для подписи:", prehash);

        const signature = crypto
            .createHmac("sha256", apiSecret)
            .update(prehash)
            .digest("base64");

        const headers = {
            'Content-Type': 'application/json',
            'OK-ACCESS-KEY': apiKey,
            'OK-ACCESS-SIGN': signature,
            'OK-ACCESS-TIMESTAMP': timestamp,
            'OK-ACCESS-PASSPHRASE': apiPassphrase,
            'x-simulated-trading': '1', 
        };

        const response = await axios.get(`https://www.okx.com${requestPath}`, { headers });

        if (response.data.code !== "0") {
            throw new Error(`OKX API Error: ${response.data.msg}`);
        }
        
        console.log("!!! ТЕСТ УСПЕШЕН !!! Подключение сработало!");
        res.json({ success: true, balance: response.data.data[0].totalEq });

    } catch (err) {
        const errorMessage = err.response?.data?.msg || err.message;
        console.error("!!! ТЕСТ ПРОВАЛЕН !!! Ошибка:", errorMessage);
        res.status(401).json({ success: false, error: errorMessage });
    }
});


// Остальные маршруты пока закомментированы для чистоты теста
// router.post("/purchase", ...);
// router.post("/sell", ...);
// router.get("/portfolios", ...);

module.exports = router;
