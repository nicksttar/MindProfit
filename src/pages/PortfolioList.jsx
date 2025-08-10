// src/components/ActivePortfolios.js

import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; 

// --- Вспомогательные компоненты и функции ---

// ИЗМЕНЕНО: Компонент стрелки теперь использует текстовый символ для надежности
const ArrowIcon = ({ isExpanded }) => (
    <span 
        style={{ 
            display: 'inline-block',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', 
            transition: 'transform 0.3s ease',
            cursor: 'pointer',
            color: '#9CA3AF',
            fontSize: '1.5rem',
            lineHeight: '1'
        }}
    >
        ▼
    </span>
);

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const calculateDaysActive = (dateString) => {
    const investedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - investedDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// --- Основной компонент ---

export default function ActivePortfolios({ userId, portfolios, isLoading, error, onUpdate }) {
    const [expandedPortfolioId, setExpandedPortfolioId] = useState(null);

    const handleToggleDetails = (portfolioId) => {
        setExpandedPortfolioId(currentId => (currentId === portfolioId ? null : portfolioId));
    };

    const handleSellPortfolio = async (portfolioId, portfolioType) => {
        if (window.confirm(`Вы уверены, что хотите зафиксировать портфель "${portfolioType}"?`)) {
            try {
                await axios.post('http://localhost:5000/api/binance/sell', { userId, portfolioId });
                alert('Портфель успешно зафиксирован!');
                if (onUpdate) onUpdate();
            } catch (err) {
                alert(err.response?.data?.error || 'Не удалось зафиксировать портфель.');
                if (err.response?.status === 409 && onUpdate) onUpdate();
            }
        }
    };

    const handleAddFunds = (portfolioId, portfolioType) => {
        const amountToAdd = prompt(`Какую сумму в USDT вы хотите добавить в портфель "${portfolioType}"?`);
        if (amountToAdd && !isNaN(amountToAdd) && parseFloat(amountToAdd) > 0) {
            alert(`${amountToAdd} USDT будет добавлено в портфель. (Функционал в разработке)`);
        } else if (amountToAdd !== null) {
            alert("Пожалуйста, введите корректную сумму.");
        }
    };

    if (isLoading) return <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <div className="stat-card p-4 text-center text-danger">{error}</div>;

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Мои портфели</h4>
                <a href="#manage-portfolios" className="btn btn-sm btn-outline-light">Создать новый +</a>
            </div>

            {portfolios.length === 0 ? (
                <div className="stat-card p-4 text-center">
                    <p className="mb-0" style={{color: '#9CA3AF'}}>У вас пока нет активных портфелей.</p>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {portfolios.map(p => {
                        const isExpanded = expandedPortfolioId === p._id;
                        return (
                            <div key={p._id} className="stat-card p-4">
                                {/* Основная информация о портфеле */}
                                <div className="row align-items-center g-3">
                                    <div className="col-lg-3 col-md-6"><h5 className="fw-bold mb-0">{p.type}</h5></div>
                                    <div className="col-lg-2 col-md-6"><h6 className="card-title mb-1">Вложено0</h6><p className="card-value small mb-0">${p.amount.toFixed(2)}</p></div>
                                    <div className="col-lg-3 col-md-6"><h6 className="card-title mb-1">Прибыль0 <span className="badge bg-secondary">скоро</span></h6><p className="card-value small mb-0 text-success">+$0.00 (0.00%)</p></div>
                                    <div className="col-lg-4 col-md-6">
                                        <div className="d-flex gap-2 justify-content-lg-end align-items-center">
                                            <div onClick={() => handleToggleDetails(p._id)} className="p-2">
                                                <ArrowIcon isExpanded={isExpanded} />
                                            </div>
                                            <button onClick={() => handleAddFunds(p._id, p.type)} className="btn btn-primary btn-sm">Добавить</button>
                                            <button onClick={() => handleSellPortfolio(p._id, p.type)} className="btn btn-outline-light btn-sm">Зафиксировать</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Раскрывающийся блок с деталями */}
                                <div style={{
                                    maxHeight: isExpanded ? '500px' : '0px',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.5s ease-in-out'
                                }}>
                                    <hr style={{borderColor: '#30363D', margin: '20px 0'}}/>
                                    <div className="row g-3">
                                        {p.coins.map(coin => {
                                            const investedValue = coin.quantity * coin.avgPurchasePrice;
                                            const percentage = (investedValue / p.amount) * 100;
                                            return (
                                                <div key={coin.symbol} className="col-md-6 col-lg-4">
                                                    <div className="d-flex justify-content-between align-items-center p-2 rounded" style={{backgroundColor: '#0D1117'}}>
                                                        <div>
                                                            <p className="fw-bold mb-0 small">{coin.symbol.replace('USDT', '')}</p>
                                                            <p className="mb-0 small" style={{color: '#9CA3AF'}}>Доля: {percentage.toFixed(1)}%</p>
                                                        </div>
                                                        <div className="text-end">
                                                            <p className="fw-bold mb-0 small">${investedValue.toFixed(2)}</p>
                                                            <p className="mb-0 small" style={{color: '#9CA3AF'}}>{coin.quantity.toFixed(5)}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
