const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();
const User = require("../models/User"); 
const Portfolio = require("../models/Portfolio"); 

const portfolioDefinitions = {
    "M-10": [ 
        { symbol: "BTCUSDT", percent: 80 }, 
        { symbol: "USDCUSDT", percent: 20 },
    ],
    "M-25": [],
    "ДеФай": [],
};

const BINANCE_API_URL = "https://api.binance.com";
let exchangeInfoCache = null;

// Вспомогательные функции
async function loadExchangeInfo() {
    if (exchangeInfoCache) return exchangeInfoCache;
    try {
        console.log("Загрузка правил торговли с Binance...");
        const response = await axios.get(`${BINANCE_API_URL}/api/v3/exchangeInfo`);
        const symbols = {};
        for (const symbol of response.data.symbols) {
            symbols[symbol.symbol] = {};
            for (const filter of symbol.filters) {
                if (filter.filterType === 'LOT_SIZE') {
                    symbols[symbol.symbol].stepSize = filter.stepSize;
                }
            }
        }
        exchangeInfoCache = symbols;
        console.log("Правила торговли успешно загружены и кэшированы.");
    } catch (error) {
        console.error("Не удалось загрузить правила торговли:", error.response ? error.response.data : error.message);
    }
}
loadExchangeInfo();

function formatQuantity(symbol, quantity) {
    if (!exchangeInfoCache || !exchangeInfoCache[symbol] || !exchangeInfoCache[symbol].stepSize) {
        return quantity;
    }
    const stepSize = exchangeInfoCache[symbol].stepSize;
    const precision = stepSize.indexOf('1') - 1;
    if (precision < 0) return Math.floor(quantity);
    const factor = Math.pow(10, precision);
    return Math.floor(quantity * factor) / factor;
}

async function callBinanceApi(method, path, params, apiCredentials) {
    const { apiKey, apiSecret } = apiCredentials;
    const timestamp = Date.now();
    const queryString = new URLSearchParams({ ...params, timestamp }).toString();
    const signature = crypto.createHmac("sha256", apiSecret).update(queryString).digest("hex");
    const url = `${BINANCE_API_URL}${path}?${queryString}&signature=${signature}`;
    
    try {
        const response = await axios({ method, url, headers: { 'X-MBX-APIKEY': apiKey } });
        return response.data;
    } catch (err) {
        throw new Error(err.response?.data?.msg || "Ошибка при обращении к Binance API");
    }
}


// --- МАРШРУТЫ ---

router.post("/get-balance", async (req, res) => {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, error: "UserID не предоставлен" });
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: "Пользователь не найден" });
        const apiCredentials = user.exchanges.find(ex => ex.exchangeName === 'binance');
        if (!apiCredentials) return res.status(400).json({ success: false, error: "У пользователя нет ключей Binance." });
        const accountInfo = await callBinanceApi("GET", "/api/v3/account", {}, apiCredentials);
        const usdtAsset = accountInfo.balances.find(asset => asset.asset === 'USDT');
        const usdtBalance = usdtAsset ? parseFloat(usdtAsset.free) : 0;
        res.json({ success: true, usdtBalance });
    } catch (err) {
        res.status(401).json({ success: false, error: "Сохраненные ключи невалидны. Подключите их заново." });
    }
});

router.post("/connect-and-get-balance", async (req, res) => {
    const { userId, apiKey, apiSecret } = req.body;
    if (!userId || !apiKey || !apiSecret) return res.status(400).json({ success: false, error: "Необходимы userId, apiKey и apiSecret" });
    try {
        const accountInfo = await callBinanceApi("GET", "/api/v3/account", {}, { apiKey, apiSecret });
        const usdtAsset = accountInfo.balances.find(asset => asset.asset === 'USDT');
        const usdtBalance = usdtAsset ? parseFloat(usdtAsset.free) : 0;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: "Пользователь не найден" });
        user.exchanges = user.exchanges.filter(ex => ex.exchangeName !== 'binance');
        user.exchanges.push({ exchangeName: 'binance', apiKey, apiSecret }); 
        await user.save();
        res.json({ success: true, message: "Ключи Binance успешно привязаны", usdtBalance });
    } catch (err) {
        res.status(401).json({ success: false, error: "Неверные API ключи или отсутствуют разрешения." });
    }
});

router.post("/revoke", async (req, res) => {
    const { userId, exchangeName } = req.body;
    if (!userId || !exchangeName) return res.status(400).json({ success: false, error: "Необходимы userId и exchangeName" });
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: "Пользователь не найден" });
        const initialCount = user.exchanges.length;
        user.exchanges = user.exchanges.filter(ex => ex.exchangeName !== exchangeName);
        if (user.exchanges.length === initialCount) return res.status(404).json({ success: false, error: `Подключение для ${exchangeName} не найдено.` });
        await user.save();
        res.json({ success: true, message: `Ключи для ${exchangeName} успешно отозваны.` });
    } catch (err) {
        res.status(500).json({ success: false, error: "Внутренняя ошибка сервера." });
    }
});

router.post("/purchase", async (req, res) => {
    const { userId, portfolioType, amount } = req.body;
    if (!userId) return res.status(400).json({ success: false, error: "UserID не предоставлен" });
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ success: false, error: "Пользователь не найден" });
        const apiCredentials = user.exchanges.find(ex => ex.exchangeName === 'binance');
        if (!apiCredentials) return res.status(400).json({ success: false, error: "У пользователя нет ключей Binance" });
        const definition = portfolioDefinitions[portfolioType];
        if (!definition || definition.length === 0) {
            return res.status(400).json({ success: false, error: `Определение для портфеля "${portfolioType}" не найдено.` });
        }
        const purchasedCoins = [];
        for (const coin of definition) {
            const orderAmountUsdt = (amount * coin.percent) / 100;
            if (orderAmountUsdt < 10) {
                console.log(`Пропуск ${coin.symbol}, сумма ${orderAmountUsdt.toFixed(2)} USDT слишком мала.`);
                continue;
            }
            const orderParams = { symbol: coin.symbol, side: "BUY", type: "MARKET", quoteOrderQty: orderAmountUsdt.toFixed(2) };
            const orderResponse = await callBinanceApi("POST", "/api/v3/order", orderParams, apiCredentials);
            let totalExecutedQty = 0, totalCommission = 0, totalQuoteQty = 0;
            const baseAsset = coin.symbol.replace('USDT', '');
            for (const fill of orderResponse.fills) {
                const qty = parseFloat(fill.qty);
                totalExecutedQty += qty;
                totalQuoteQty += parseFloat(fill.price) * qty;
                if (fill.commissionAsset === baseAsset) {
                    totalCommission += parseFloat(fill.commission);
                }
            }
            const netQuantity = totalExecutedQty - totalCommission;
            const avgPurchasePrice = totalQuoteQty / totalExecutedQty;
            purchasedCoins.push({ symbol: coin.symbol, quantity: netQuantity, avgPurchasePrice });
        }
        if (purchasedCoins.length === 0) {
            throw new Error("Не удалось купить ни одной монеты. Возможно, общая сумма инвестиций была слишком мала для разделения.");
        }
        const newPortfolio = new Portfolio({ userId, type: portfolioType, amount, investedAt: new Date(), status: "active", coins: purchasedCoins });
        await newPortfolio.save();
        user.portfolios.push(newPortfolio._id);
        await user.save();
        res.json({ success: true, portfolio: newPortfolio });
    } catch (err) {
        res.status(500).json({ success: false, error: "Ошибка при покупке портфеля: " + err.message });
    }
});

router.get("/portfolios/:userId", async (req, res) => {
    const { userId } = req.params;
    try {
        const portfolios = await Portfolio.find({ userId: userId, status: "active" });
        res.json({ success: true, portfolios });
    } catch (err) {
        res.status(500).json({ success: false, error: "Ошибка при получении портфелей" });
    }
});

// ИЗМЕНЕНО: Добавлена проверка баланса перед продажей
router.post("/sell", async (req, res) => {
    const { userId, portfolioId } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "Пользователь не найден" });

        const apiCredentials = user.exchanges.find(ex => ex.exchangeName === 'binance');
        if (!apiCredentials) return res.status(400).json({ error: "Ключи Binance не найдены" });
        
        const portfolio = await Portfolio.findOne({ _id: portfolioId, userId: userId });
        if (!portfolio) return res.status(404).json({ error: "Портфель не найден или не принадлежит пользователю" });

        // --- НАЧАЛО ПРОВЕРКИ ---
        const accountInfo = await callBinanceApi("GET", "/api/v3/account", {}, apiCredentials);
        let isOutOfSync = false;

        for (const coin of portfolio.coins) {
            const assetName = coin.symbol.replace('USDT', '');
            const exchangeAsset = accountInfo.balances.find(b => b.asset === assetName);
            const freeBalance = exchangeAsset ? parseFloat(exchangeAsset.free) : 0;
            
            // Сравниваем баланс на бирже с тем, что мы собираемся продать
            if (freeBalance < coin.quantity * 0.99) { // 0.99 для небольшой погрешности
                isOutOfSync = true;
                break; // Если хотя бы одна монета отсутствует, выходим из цикла
            }
        }

        if (isOutOfSync) {
            // Если портфель рассинхронизирован, удаляем его из нашей БД
            await Portfolio.findByIdAndDelete(portfolioId);
            user.portfolios.pull(portfolioId);
            await user.save();
            // Отправляем специальный статус и сообщение
            return res.status(409).json({ 
                success: false, 
                error: "Портфель не актуален. Возможно, вы продали активы напрямую на бирже. Портфель был удален из системы." 
            });
        }
        // --- КОНЕЦ ПРОВЕРКИ ---

        // Если проверка пройдена, продаем активы
        for (const coin of portfolio.coins) {
            if (coin.quantity <= 0) continue;
            
            const formattedQuantity = formatQuantity(coin.symbol, coin.quantity);
            if (formattedQuantity <= 0) continue;

            const orderParams = { symbol: coin.symbol, side: "SELL", type: "MARKET", quantity: formattedQuantity };
            await callBinanceApi("POST", "/api/v3/order", orderParams, apiCredentials);
        }

        // После успешной продажи удаляем портфель
        await Portfolio.findByIdAndDelete(portfolioId);
        user.portfolios.pull(portfolioId);
        await user.save();

        res.json({ success: true, message: "Портфель успешно зафиксирован." });
    } catch (err) {
        console.error("Полная ошибка при фиксации портфеля:", err);
        res.status(500).json({ success: false, error: "Ошибка при фиксации портфеля: " + err.message });
    }
});

module.exports = router;
