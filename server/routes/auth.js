const express = require("express");
const router = express.Router();
const User = require("../models/User");
// В реальном проекте для хэширования паролей лучше использовать bcrypt
// npm install bcryptjs
// const bcrypt = require('bcryptjs');

// --- РЕГИСТРАЦИЯ ---
router.post("/register", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Проверяем, не занят ли email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "Пользователь с таким email уже существует" });
        }

        // Создаем нового пользователя
        user = new User({
            email,
            password, // ВАЖНО: В реальном приложении здесь должно быть хэширование пароля
            exchanges: [],
            portfolios: []
        });

        await user.save();

        // Отправляем ID нового пользователя на фронтенд
        res.status(201).json({
            success: true,
            userId: user._id,
        });

    } catch (err) {
        console.error("Ошибка регистрации:", err.message);
        res.status(500).json({ success: false, error: "Ошибка сервера" });
    }
});


// --- ВХОД В СИСТЕМУ ---
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Ищем пользователя по email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Неверные учетные данные" });
        }

        // Проверяем пароль (сейчас простое сравнение, в реальности должно быть bcrypt.compare)
        if (password !== user.password) {
            return res.status(400).json({ success: false, error: "Неверные учетные данные" });
        }

        // Отправляем ID пользователя на фронтенд
        res.json({
            success: true,
            userId: user._id,
        });

    } catch (err) {
        console.error("Ошибка входа:", err.message);
        res.status(500).json({ success: false, error: "Ошибка сервера" });
    }
});

// --- ИЗМЕНЕНО: ДОБАВЛЕН НОВЫЙ МАРШРУТ ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ ---
router.get("/user/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ error: "Пользователь не найден" });
        }
        
        // Отправляем все необходимые данные, включая массив exchanges
        res.json({
            email: user.email,
            // name: user.name, // Если у вас есть поле с именем
            exchanges: user.exchanges 
        });

    } catch (error) {
        console.error("Ошибка получения данных пользователя:", error.message);
        res.status(500).json({ error: "Ошибка сервера" });
    }
});


module.exports = router;
