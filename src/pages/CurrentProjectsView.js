// src/pages/CurrentProjectsView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrentProjectsView = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Отправляем GET-запрос на наш бэкенд
                const res = await axios.get('http://localhost:5000/api/projects');
                setProjects(res.data);
            } catch (err) {
                console.error("Ошибка при загрузке проектов:", err);
                setError('Не удалось загрузить проекты. Попробуйте обновить страницу.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, []); // Пустой массив зависимостей означает, что эффект запустится один раз

    // Пока идет загрузка
    if (isLoading) {
        return <div className="text-center p-5"><h4>🚀 Загрузка актуальных проектов...</h4></div>;
    }

    // Если произошла ошибка
    if (error) {
        return <div className="text-center p-5 alert alert-danger">{error}</div>;
    }

    return (
        <div className="container my-5">
            <h2 className="text-center fw-bold mb-4">🚀 Актуальные проекты</h2>
            
            {/* Если проектов нет */}
            {projects.length === 0 ? (
                <div className="text-center p-5 action-card">
                     <p style={{ color: '#9CA3AF' }}>Пока нет активных проектов. Администратор скоро их добавит!</p>
                </div>
            ) : (
                // Если проекты есть, отображаем их в виде карточек
                <div className="row g-4">
                    {projects.map(project => (
                        <div className="col-md-6 col-lg-4" key={project._id}>
                            <div className="card h-100 shadow-sm border-0">
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold">{project.title}</h5>
                                    <p className="card-text flex-grow-1" style={{ color: '#6B7280' }}>{project.description}</p>
                                    {project.link && (
                                        <a href={project.link} className="btn btn-primary mt-auto" target="_blank" rel="noopener noreferrer">
                                            Перейти к проекту
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurrentProjectsView;
