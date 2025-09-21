const express = require('express');
const router = express.Router();
const axios = require('axios');
 
// ИЗМЕНЕНО: Общий маршрут для получения всей аналитики
// @route   GET /api/analytics/all
// @desc    Прокси-запрос для получения данных с CoinGecko
router.get('/all', async (req, res) => {
    try {
        const axiosOptions = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        // ИЗМЕНЕНО: Объединяем запросы в один, чтобы избежать rate-limit ошибок
        const [globalRes, marketsRes] = await Promise.all([
            axios.get('https://api.coingecko.com/api/v3/global', axiosOptions),
            axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false&ids=ethereum', axiosOptions)
        ]);

        // Извлекаем данные по Ethereum из общего списка
        const ethDataFromMarkets = marketsRes.data.find(c => c.id === 'ethereum');

        // Отправляем все результаты в одном ответе.
        // gasPrice пока остается заглушкой, так как для него нужен отдельный API.
        res.json({ 
            global: globalRes.data.data, 
            markets: marketsRes.data,
            ethData: { 
                ethPrice: ethDataFromMarkets ? { usd: ethDataFromMarkets.current_price } : { usd: 0 }, 
                gasPrice: 20 
            }
        });
    } catch (error) {
        console.error("Ошибка при запросе к CoinGecko:", error.message);
        res.status(502).json({ error: 'Не удалось получить данные от внешнего сервиса.' });
    }
});
module.exports = router;