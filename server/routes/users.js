// server/routes/users.js
const express = require('express');
const router = express.Router();
// Предполагаем, что ваша модель пользователя находится здесь
const User = require('../models/User'); 

// @route   GET /api/users
// @desc    Получить всех пользователей
// @access  Private (нужно защитить)
router.get('/', async (req, res) => {
    try {
        // Находим всех пользователей и убираем поле с паролем из ответа
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

// @route   DELETE /api/users/:id
// @desc    Удалить пользователя по ID
// @access  Private (нужно защитить)
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'Пользователь не найден' });
        }

        res.json({ msg: 'Пользователь успешно удален' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});

module.exports = router;
