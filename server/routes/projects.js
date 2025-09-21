const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// @route   GET /api/projects
// @desc    Получить все проекты
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find().sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        console.error(err.message); // ВОССТАНОВЛЕНО
        res.status(500).send('Ошибка сервера'); // ВОССТАНОВЛЕНО
    }
});

// @route   POST /api/projects
// @desc    Создать новый проект
router.post('/', async (req, res) => {
    const { title, description, link } = req.body;

    // ВОССТАНОВЛЕНО: Простая валидация
    if (!title || !description) {
        return res.status(400).json({ msg: 'Пожалуйста, заполните название и описание' });
    }

    try {
        // ВОССТАНОВЛЕНО: Создание проекта без imageUrl
        const newProject = new Project({
            title,
            description,
            link
        });

        const project = await newProject.save();
        res.status(201).json(project); // ВОССТАНОВЛЕНО
    } catch (err) {
        console.error(err.message); // ВОССТАНОВЛЕНО
        res.status(500).send('Ошибка сервера'); // ВОССТАНОВЛЕНО
    }
});

// @route   DELETE /api/projects/:id
// @desc    Удалить проект по ID
router.delete('/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);

        if (!project) {
            return res.status(404).json({ msg: 'Проект не найден' });
        }

        res.json({ msg: 'Проект успешно удален' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Ошибка сервера');
    }
});


module.exports = router;
