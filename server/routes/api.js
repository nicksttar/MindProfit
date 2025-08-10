const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/connect-okx", async (req, res) => {
  const { apiKey, apiSecret } = req.body;

  try {
    // Пример проверки баланса или другой простой команды
    const response = await axios.get("https://www.okx.com/api/v5/account/balance", {
      headers: {
        'OK-ACCESS-KEY': apiKey,
        'OK-ACCESS-SIGN': 'SIGNATURE', // нужно сгенерировать правильно
        'OK-ACCESS-TIMESTAMP': new Date().toISOString(),
        'OK-ACCESS-PASSPHRASE': 'YOUR_PASSPHRASE',
      }
    });

    res.json({ success: true, data: response.data });
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, error: "Ошибка подключения к OKX" });
  }
});

module.exports = router;
