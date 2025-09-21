// src/pages/CurrentProjectsView.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ИЗМЕНЕНО: Добавлен компонент модального окна
const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1050,
        }}>
            <div className="stat-card p-4" style={{ width: '100%', maxWidth: '550px', maxHeight: '80vh', overflowY: 'auto', backgroundColor: '#161B22', borderRadius: '8px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">{title}</h5>
                    <button onClick={onClose} className="btn-close btn-close-white"></button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const CurrentProjectsView = () => {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedProject, setSelectedProject] = useState(null); // ИЗМЕНЕНО: Состояние для модального окна

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
            {/* Если проектов нет */}
            {projects.length === 0 ? (
                <div className="text-center p-5 action-card">
                     <p style={{ color: '#9CA3AF' }}>Пока нет активных проектов. Администратор скоро их добавит!</p>
                </div>
            ) : (
                // Если проекты есть, отображаем их в виде карточек
                <div className="row g-4">
                    {projects.map(project => {
                        const isLong = project.description.length > 150;
                        const description = isLong 
                            ? `${project.description.substring(0, 150)}...` 
                            : project.description;

                        return (
                            <div className="col-md-6 col-lg-4" key={project._id}>
                                <div className="card h-100 shadow-sm border-0 d-flex flex-column">
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title fw-bold">{project.title}</h5>
                                        <p className="card-text flex-grow-1" style={{ color: '#6B7280', whiteSpace: 'pre-line' }}>{description}</p>
                                        
                                        {/* ИЗМЕНЕНО: Блок с кнопками */}
                                        <div className="mt-auto d-flex gap-2">
                                            {project.link && (
                                                <a href={project.link} className="btn btn-primary flex-grow-1" target="_blank" rel="noopener noreferrer">
                                                    Перейти
                                                </a>
                                            )}
                                            {isLong && (
                                                <button onClick={() => setSelectedProject(project)} className="btn btn-outline-secondary">Читать далее</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* ИЗМЕНЕНО: Модальное окно для полного просмотра проекта */}
            {selectedProject && (
                <Modal 
                    isOpen={!!selectedProject} 
                    onClose={() => setSelectedProject(null)} 
                    title={selectedProject.title}
                >
                    <p style={{ color: '#9CA3AF', whiteSpace: 'pre-line' }}>{selectedProject.description}</p>
                    {selectedProject.link && (
                        <a href={selectedProject.link} className="btn btn-primary mt-3" target="_blank" rel="noopener noreferrer">Перейти к проекту</a>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default CurrentProjectsView;
