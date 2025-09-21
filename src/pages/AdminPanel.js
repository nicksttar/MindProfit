// src/pages/AdminPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminPanel = () => {
    // --- Состояния для управления проектами ---
    const [formData, setFormData] = useState({ title: '', description: '', link: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [projects, setProjects] = useState([]);
    const [isLoadingProjects, setIsLoadingProjects] = useState(true);

    // --- Состояния для управления пользователями ---
    const [users, setUsers] = useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    // --- Загрузка всех данных при первом рендере ---
    useEffect(() => {
        fetchProjects();
        fetchUsers();
    }, []);

    // --- Функции для работы с ПРОЕКТАМИ ---
    const fetchProjects = async () => {
        try {
            setIsLoadingProjects(true);
            const res = await axios.get('http://localhost:5000/api/projects');
            setProjects(res.data);
        } catch (err) {
            console.error("Ошибка при загрузке проектов:", err);
        } finally {
            setIsLoadingProjects(false);
        }
    };

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            // ВОССТАНОВЛЕНО: Отправка обычного JSON
            await axios.post('http://localhost:5000/api/projects', formData);
            setMessage('Проект успешно добавлен!');
            // ВОССТАНОВЛЕНО: Простая очистка формы
            setFormData({ title: '', description: '', link: '' });
            fetchProjects();
        } catch (err) {
            setMessage(err.response?.data?.msg || 'Ошибка при добавлении проекта.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleProjectDelete = async (projectId) => {
        if (window.confirm('Вы уверены, что хотите удалить этот проект?')) {
            try {
                await axios.delete(`http://localhost:5000/api/projects/${projectId}`);
                setProjects(projects.filter(p => p._id !== projectId));
            } catch (err) {
                alert('Не удалось удалить проект.');
            }
        }
    };

    // --- Функции для работы с ПОЛЬЗОВАТЕЛЯМИ ---
    const fetchUsers = async () => {
        try {
            setIsLoadingUsers(true);
            const res = await axios.get('http://localhost:5000/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Ошибка при загрузке пользователей:", err);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleUserDelete = async (userId) => {
        if (window.confirm('Вы уверены, что хотите удалить этого пользователя? Это действие необратимо.')) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${userId}`);
                setUsers(users.filter(u => u._id !== userId));
            } catch (err) {
                alert('Не удалось удалить пользователя.');
            }
        }
    };

    return (
        // Используем container-fluid для полной ширины
        <div className="container-fluid mt-4 px-4">
            <div className="row g-4">
                
                {/* --- КОЛОНКА 1: ПРОЕКТЫ --- */}
                <div className="col-lg-4">
                    <h3 className="mb-3">Управление проектами</h3>
                    <div className="card p-3 shadow-sm mb-4">
                        <form onSubmit={handleSubmit}>
                            <h5 className="mb-3">Добавить проект</h5>
                            <div className="mb-2">
                                <label className="form-label small">Название</label>
                                <input type="text" className="form-control" name="title" value={formData.title} onChange={onChange} required />
                            </div>
                            <div className="mb-2">
                                <label className="form-label small">Описание</label>
                                <textarea className="form-control" name="description" rows="3" value={formData.description} onChange={onChange} required></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small">Ссылка</label>
                                <input type="url" className="form-control" name="link" value={formData.link} onChange={onChange} placeholder="https://..." />
                            </div>
                            <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                                {isSubmitting ? 'Добавление...' : 'Добавить'}
                            </button>
                        </form>
                        {message && <div className={`alert ${message.includes('ошибка') ? 'alert-danger' : 'alert-success'} mt-3 small`}>{message}</div>}
                    </div>

                    <h5 className="mb-3">Все объявления</h5>
                    {isLoadingProjects ? <p>Загрузка...</p> : (
                        <div className="list-group" style={{maxHeight: '50vh', overflowY: 'auto'}}>
                            {projects.map(project => (
                                <div key={project._id} className="list-group-item list-group-item-action flex-column align-items-start mb-2 border rounded">
                                    <div className="d-flex w-100 justify-content-between">
                                        <h6 className="mb-1">{project.title}</h6>
                                        <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => handleProjectDelete(project._id)}>X</button>
                                    </div>
                                    <p className="mb-1 small" style={{ wordBreak: 'break-word' }}>{project.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* --- КОЛОНКА 2: ПОЛЬЗОВАТЕЛИ --- */}
                <div className="col-lg-5">
                    <h3 className="mb-3">Управление пользователями</h3>
                    {isLoadingUsers ? <p>Загрузка...</p> : (
                        <div className="table-responsive" style={{maxHeight: '80vh', overflowY: 'auto'}}>
                            <table className="table table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>ID</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user._id}>
                                            <td>{user.email}</td>
                                            <td><small className="text-muted">{user._id}</small></td>
                                            <td className="text-end">
                                                <button className="btn btn-sm btn-danger" onClick={() => handleUserDelete(user._id)}>Удалить</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* --- КОЛОНКА 3: ЛОГИ (заготовка) --- */}
                <div className="col-lg-3">
                    <h3 className="mb-3">Логи</h3>
                    <div className="card p-3 shadow-sm">
                        <p className="text-muted">Этот раздел находится в разработке. Здесь будет отображаться активность пользователей.</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminPanel;
