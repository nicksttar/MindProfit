import React, { useState } from 'react';
import axios from 'axios';
import '../App.css'; 

// --- Вспомогательные компоненты ---

// Компонент для модального окна, скопированный из ActivePortfolios.js
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
            <div className="stat-card p-4" style={{ width: '100%', maxWidth: '500px', height: 'auto' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="fw-bold mb-0">{title}1</h5>
                    <button onClick={onClose} className="btn-close btn-close-white"></button>
                </div>
                <div>{children}</div>
            </div>
        </div>
    );
};

const portfolios = [
    { id: 'm10', name: 'M-10', description: 'Топ 10 монет по капитализации.' },
    { id: 'm25', name: 'M-25', description: 'Расширенный список из 25 криптовалют.' },
    { id: 'defi', name: 'ДеФай', description: 'Активы из сектора DeFi.' },
];

const exchanges = [
    { id: 'binance', name: 'Binance', logo: '/img/binance.png', available: true },
    { id: 'okx', name: 'OKX', logo: '/img/okx.png', available: false },
    { id: 'bybit', name: 'Bybit', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Bybit_logo.svg', available: false },
];

export default function ReadyPortfolioWizard({ userId, hasBinanceKeys, onPortfolioCreated }) {
    const [isWizardActive, setIsWizardActive] = useState(false);
    const [step, setStep] = useState(1);
    const [selectedPortfolio, setSelectedPortfolio] = useState(null);
    const [selectedExchange, setSelectedExchange] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [usdtBalance, setUsdtBalance] = useState(0);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [apiSecret, setApiSecret] = useState('');
    const [apiError, setApiError] = useState('');

    // ИЗМЕНЕНО: Состояние для модального окна подтверждения
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    const startWizard = () => setIsWizardActive(true);

    const resetWizard = () => {
        setIsWizardActive(false);
        setStep(1);
        setSelectedPortfolio(null);
        setSelectedExchange(null);
        setInvestmentAmount('');
        setApiError('');
        setApiKey('');
        setApiSecret('');
    };

    const handleBack = () => {
        setApiError('');
        if (step > 1) {
            if (step === 4 && hasBinanceKeys) setStep(2);
            else setStep(step - 1);
        } else {
            resetWizard();
        }
    };

    const handleSelectPortfolio = (portfolio) => {
        setSelectedPortfolio(portfolio);
        setStep(2);
    };

    const handleSelectExchange = (exchange) => {
        setSelectedExchange(exchange);
        if (exchange.id === 'binance' && hasBinanceKeys) {
            fetchBalanceWithSavedKeys();
        } else {
            setStep(3);
        }
    };

    const fetchBalanceWithSavedKeys = async () => {
        setIsLoading(true);
        setApiError('');
        try {
            const { data } = await axios.post('/api/binance/get-balance', { userId });
            if (data.success) {
                setUsdtBalance(data.usdtBalance);
                setStep(4);
            }
        } catch (err) {
            setApiError(err.response?.data?.error || 'Ошибка. Пожалуйста, подключите ключи заново.');
            setStep(3);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnectApi = async () => {
        if (!userId) return setApiError('Ошибка: ID пользователя не найден.');
        if (!apiKey || !apiSecret) return setApiError('Пожалуйста, введите оба ключа.');
        setApiError('');
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/binance/connect-and-get-balance', { userId, apiKey, apiSecret });
            if (data.success) {
                setUsdtBalance(data.usdtBalance);
                setStep(4);
            }
        } catch (err) {
            setApiError(err.response?.data?.error || 'Не удалось подключиться.');
        } finally {
            setIsLoading(false);
        }
    };

    // ИЗМЕНЕНО: Эта функция теперь только открывает модальное окно
    const handleCreatePortfolio = () => {
        const amount = parseFloat(investmentAmount);
        if (!amount || amount <= 0) return setApiError("Введите корректную сумму.");
        if (amount > usdtBalance) return setApiError("Сумма превышает доступный баланс.");
        
        setApiError('');
        setIsConfirmModalOpen(true); // Открываем модальное окно
    };
    
    // ИЗМЕНЕНО: Новая функция для подтверждения создания из модального окна
    const handleConfirmCreate = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.post('/api/binance/purchase', {
                userId,
                portfolioType: selectedPortfolio.name,
                amount: parseFloat(investmentAmount)
            });
            if (data.success) {
                alert(`Портфель "${selectedPortfolio.name}" успешно создан!`);
                resetWizard();
                if (onPortfolioCreated) {
                    onPortfolioCreated();
                }
            }
        } catch (err) {
            // Ошибку покажем в alert, так как модальное окно закроется
            alert(err.response?.data?.error || 'Не удалось создать портфель.');
        } finally {
            setIsLoading(false);
            setIsConfirmModalOpen(false);
        }
    };

    if (!isWizardActive) {
        return <button onClick={startWizard} className="btn btn-primary w-100">Выбрать портфель</button>;
    }

    return (
        <div className="wizard-container">
            <div className="wizard-header"><button onClick={handleBack} className="back-button">← Назад</button></div>

            {step === 1 && (
                <div className="wizard-step">
                    <h5 className="fw-bold">Шаг 1: Выберите готовый портфель</h5>
                    <div className="portfolio-list mt-4">
                        {portfolios.map(p => (
                            <div key={p.id} className="portfolio-item" onClick={() => handleSelectPortfolio(p)}>
                                <div className="portfolio-item-info"><h6>{p.name}</h6><p>{p.description}</p></div>
                                <div className="portfolio-item-arrow">→</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="wizard-step">
                    <h5 className="fw-bold">Шаг 2: Выберите биржу</h5>
                    {isLoading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Загрузка...</span>
                            </div>
                            <p className="mt-3 form-text">Проверяем подключение...</p>
                        </div>
                    ) : (
                        <div className="exchange-selection-list mt-4">
                            {exchanges.map(ex => (
                                <div key={ex.id} className={`exchange-item ${!ex.available ? 'disabled' : ''}`} onClick={() => ex.available && handleSelectExchange(ex)}>
                                    <img src={ex.logo} alt={ex.name} className="exchange-logo-wizard" />
                                    <span>{ex.name}</span>
                                    {!ex.available && <span className="badge bg-secondary ms-auto">Скоро</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="wizard-step">
                    <h5 className="fw-bold">Шаг 3: Подключите {selectedExchange?.name}</h5>
                    <p className="form-text mb-4">Введите ваши API ключи. Они хранятся в зашифрованном виде.</p>
                    {apiError && <div className="alert alert-danger p-2 text-center small mb-3">{apiError}</div>}
                    <div className="mb-3">
                        <label className="form-label">API Key</label>
                        <input type="text" className="form-control" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Secret Key</label>
                        <input type="password" className="form-control" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
                    </div>
                    <div className="d-flex gap-3 mt-4">
                        <button onClick={handleConnectApi} className="btn btn-primary flex-grow-1" disabled={isLoading}>
                            {isLoading ? 'Проверяем...' : 'Подключить и проверить баланс'}
                        </button>
                        <button className="btn btn-outline-light">Инструкция</button>
                    </div>
                </div>
            )}
            
            {step === 4 && (
                 <div className="wizard-step">
                     <h5 className="fw-bold">Шаг 4: Создание портфеля "{selectedPortfolio?.name}"</h5>
                     <p className="form-text mb-4">Укажите сумму для инвестирования.</p>
                     {apiError && <div className="alert alert-danger p-2 text-center small mb-3">{apiError}</div>}
                     <div className="p-3 rounded mb-3" style={{backgroundColor: '#0D1117', border: '1px solid #30363D'}}>
                        <span className="form-text">Доступный баланс на {selectedExchange?.name}:</span>
                        <h4 className="fw-bold text-success mb-0">{usdtBalance.toFixed(2)} USDT</h4>
                     </div>
                     <div className="mb-3">
                         <label className="form-label">Сумма для портфеля (USDT)</label>
                         <div className="input-group">
                             <input type="number" className="form-control" value={investmentAmount} onChange={(e) => setInvestmentAmount(e.target.value)} placeholder="Например: 500" />
                             <button className="btn btn-outline-light" type="button" onClick={() => setInvestmentAmount(usdtBalance.toFixed(2))}>Max</button>
                         </div>
                     </div>
                     <div className="d-grid mt-4">
                         <button onClick={handleCreatePortfolio} className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Создание...' : 'Создать портфель'}
                         </button>
                     </div>
                 </div>
            )}

            {/* ИЗМЕНЕНО: Модальное окно для подтверждения создания портфеля */}
            <Modal 
                isOpen={isConfirmModalOpen} 
                onClose={() => setIsConfirmModalOpen(false)} 
                title="Подтверждение операции"
            >
                <p style={{color: '#9CA3AF'}}>
                    Вы собираетесь создать портфель "{selectedPortfolio?.name}" на сумму <strong>{investmentAmount} USDT</strong>.
                    Средства будут списаны с вашего баланса на {selectedExchange?.name}. Продолжить?
                </p>
                <div className="d-flex justify-content-end gap-2 mt-4">
                    <button onClick={() => setIsConfirmModalOpen(false)} className="btn btn-outline-light">Отмена</button>
                    <button onClick={handleConfirmCreate} className="btn btn-primary" disabled={isLoading}>
                        {isLoading ? 'Выполнение...' : 'Да, создать'}
                    </button>
                </div>
            </Modal>
        </div>
    );
}
