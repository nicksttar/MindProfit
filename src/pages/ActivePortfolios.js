// src/components/ActivePortfolios.js

import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; 

// --- Вспомогательные компоненты и функции ---

// Компонент для модального окна
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
            <div className="stat-card p-4" style={{ width: '100%', maxWidth: '500px', height: 'auto', backgroundColor: '#161B22', borderRadius: '8px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">{title}</h5>
                    <button onClick={onClose} className="btn-close btn-close-white"></button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};


const ArrowIcon = ({ isExpanded }) => (
    <span style={{ display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease', cursor: 'pointer', color: '#9CA3AF', fontSize: '1.5rem', lineHeight: '1' }}>
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
    
    // Состояния для управления модальными окнами
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSellModalOpen, setIsSellModalOpen] = useState(false);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [amountToAdd, setAmountToAdd] = useState('');

    const handleToggleDetails = (portfolioId) => {
        setExpandedPortfolioId(currentId => (currentId === portfolioId ? null : portfolioId));
    };

    // --- Логика для модальных окон ---
    
    // Открыть модальное окно продажи
    const openSellModal = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setIsSellModalOpen(true);
    };

    // Открыть модальное окно добавления средств
    const openAddFundsModal = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setAmountToAdd(''); // Сбрасываем инпут
        setIsAddModalOpen(true);
    };

    // Закрыть все модальные окна
    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsSellModalOpen(false);
        setSelectedPortfolio(null);
    };

    // Подтверждение продажи
    const handleConfirmSell = async () => {
        if (!selectedPortfolio) return;
        try {
            await axios.post('http://localhost:5000/api/binance/sell', { userId, portfolioId: selectedPortfolio._id });
            alert('Портфель успешно зафиксирован!');
            if (onUpdate) onUpdate();
        } catch (err) {
            alert(err.response?.data?.error || 'Не удалось зафиксировать портфель.');
            if (err.response?.status === 409 && onUpdate) onUpdate();
        } finally {
            closeModal();
        }
    };

    // Подтверждение добавления средств
    const handleConfirmAddFunds = () => {
        if (!selectedPortfolio || !amountToAdd || isNaN(amountToAdd) || parseFloat(amountToAdd) <= 0) {
            alert("Пожалуйста, введите корректную сумму.");
            return;
        }
        alert(`Добавление ${amountToAdd} USDT в портфель "${selectedPortfolio.type}". (Функционал в разработке)`);
        closeModal();
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
                        const currentValue = p.amount; 
                        const profit = currentValue - p.amount;
                        const profitPercent = 0;
                        const isPositive = profit >= 0;

                        return (
                            <div key={p._id} className="stat-card p-4">
                                <div className="row align-items-center g-3">
                                    <div className="col-lg-3 col-md-6">
                                        <h5 className="fw-bold mb-1">{p.type}</h5>
                                        <span className="small" style={{color: '#9CA3AF'}}>
                                            {formatDate(p.investedAt)} ({calculateDaysActive(p.investedAt)} дн.)
                                        </span>
                                    </div>
                                    <div className="col-lg-2 col-md-6">
                                        <h6 className="card-title mb-1">Вложено</h6>
                                        <p className="card-value small mb-0">${p.amount.toFixed(2)}</p>
                                    </div>
                                    <div className="col-lg-2 col-md-6">
                                        <h6 className="card-title mb-1">Текущая стоимость</h6>
                                        <p className="card-value small mb-0">${currentValue.toFixed(2)} <span className="badge bg-secondary">скоро</span></p>
                                    </div>
                                    <div className="col-lg-2 col-md-6">
                                        <h6 className="card-title mb-1">Прибыль</h6>
                                        <p className={`card-value small mb-0 ${isPositive ? 'text-success' : 'text-danger'}`}>
                                            {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({profitPercent.toFixed(2)}%)
                                        </p>
                                    </div>
                                    <div className="col-lg-3 col-md-12">
                                        <div className="d-flex gap-2 justify-content-lg-end align-items-center">
                                            <div onClick={() => handleToggleDetails(p._id)} className="p-2">
                                                <ArrowIcon isExpanded={isExpanded} />
                                            </div>
                                            <button onClick={() => openAddFundsModal(p)} className="btn btn-primary btn-sm flex-grow-1 flex-lg-grow-0">
                                                Добавить
                                            </button>
                                            <button onClick={() => openSellModal(p)} className="btn btn-outline-light btn-sm flex-grow-1 flex-lg-grow-0">
                                                Зафиксировать
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                
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

            {/* Модальное окно для добавления средств */}
            <Modal isOpen={isAddModalOpen} onClose={closeModal} title={`Добавить в портфель "${selectedPortfolio?.type}"`}>
                <div className="mb-3">
                    <label className="form-label">Сумма для добавления (USDT)</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={amountToAdd}
                        onChange={(e) => setAmountToAdd(e.target.value)}
                        placeholder="Например: 100"
                    />
                </div>
                <div className="d-flex justify-content-end gap-2">
                    <button onClick={closeModal} className="btn btn-outline-light">Отмена</button>
                    <button onClick={handleConfirmAddFunds} className="btn btn-primary">Подтвердить</button>
                </div>
            </Modal>

            {/* Модальное окно для подтверждения продажи */}
            <Modal isOpen={isSellModalOpen} onClose={closeModal} title={`Зафиксировать портфель "${selectedPortfolio?.type}"`}>
                <p style={{color: '#9CA3AF'}}>Вы уверены? Все активы в этом портфеле будут проданы по текущей рыночной цене. Это действие нельзя будет отменить.</p>
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button onClick={closeModal} className="btn btn-outline-light">Отмена</button>
                    <button onClick={handleConfirmSell} className="btn btn-danger">Да, зафиксировать</button>
                </div>
            </Modal>
        </div>
    );
}
