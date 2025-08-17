// server/models/Project.js
const mongoose = require('mongoose');

// Описываем схему (структуру) для документа в коллекции "projects"
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Название проекта обязательно для заполнения']
    },
    description: {
        type: String,
        required: [true, 'Описание проекта обязательно для заполнения']
    },
    link: {
        type: String,
        default: '' // Поле не обязательное, по умолчанию будет пустой строкой
    },
    createdAt: {
        type: Date,
        default: Date.now // Дата создания будет добавляться автоматически
    }
});

// Экспортируем модель. Mongoose автоматически создаст коллекцию "projects" (во множественном числе)
module.exports = mongoose.model('Project', projectSchema);
