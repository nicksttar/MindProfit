// src/pages/PortfolioView.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';
import ReadyPortfolioWizard from './ReadyPortfolioWizard';
import ActivePortfolios from './ActivePortfolios';

/**
 * Отображает все содержимое для вкладки "Портфели".
 * Управляет состоянием портфелей и API-ключей.
 */
export default function PortfolioView({ userId }) {
    const [portfolios, setPortfolios] = useState([]);
    const [hasBinanceKeys, setHasBinanceKeys] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Функция для загрузки (и перезагрузки) всех данных для этой страницы
    const fetchData = async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            // Используем Promise.all для параллельного выполнения запросов
            const [portfoliosRes, balanceRes] = await Promise.all([
                axios.get(`/api/binance/portfolios/${userId}`),
                axios.post('/api/binance/get-balance', { userId })
            ]);

            setPortfolios(portfoliosRes.data.portfolios);
            // Если запрос на баланс успешен, значит ключи есть
            setHasBinanceKeys(balanceRes.data.success);

        } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            if (err.config.url.includes('get-balance')) {
                setHasBinanceKeys(false); // Ключей нет или они невалидны
            }
            if (err.config.url.includes('portfolios')) {
                setError("Не удалось загрузить активные портфели.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Загружаем данные при первой загрузке компонента
    useEffect(() => {
        fetchData();
    }, [userId]);

    return (
        <div>
            {/* Статистика */}
            <div className="row mb-5">
                <div className="col-lg-4 col-md-6 mb-4"><div className="stat-card"><h6 className="card-title">Текущий баланс</h6><p className="card-value">$1,250.00</p></div></div>
                <div className="col-lg-4 col-md-6 mb-4"><div className="stat-card"><h6 className="card-title">Активных портфелей</h6><p className="card-value">{portfolios.length}</p></div></div>
                <div className="col-lg-4 col-md-12 mb-4"><div className="stat-card"><h6 className="card-title">Доход за месяц</h6><p className="card-value text-success">+$84.50</p></div></div>
            </div>

            {/* Мои портфели */}
            <div className="mb-5">
                <ActivePortfolios
                    userId={userId}
                    portfolios={portfolios}
                    isLoading={isLoading}
                    error={error}
                    onUpdate={fetchData} // Передаем функцию для обновления
                />
            </div>

            {/* Управление */}
            <h4 id="manage-portfolios" className="mb-4">Управление портфелями</h4>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <div className="action-card p-4">
                        <h5 className="fw-bold">Выбрать готовый портфель</h5>
                        <p style={{ color: '#9CA3AF' }} className="mb-4">Идеально для новичков, чтобы быстро начать.</p>
                        <ReadyPortfolioWizard
                            userId={userId}
                            hasBinanceKeys={hasBinanceKeys}
                            onPortfolioCreated={fetchData} // После создания портфеля вызываем обновление
                        />
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="action-card p-4">
                        <h5 className="fw-bold">Создать собственный портфель</h5>
                        <p style={{ color: '#9CA3AF' }} className="mb-4">Настройте пропорции под свои цели и уровень риска.</p>
                        <button className="btn btn-outline-light w-100" disabled>Создать (скоро)</button>
                    </div>
                </div>
            </div>
        </div>
    );
}