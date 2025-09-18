import React, { useState, useEffect } from 'react';

// --- Иконки ---
const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye-fill" viewBox="0 0 16 16">
        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
    </svg>
);

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16">
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash3-fill" viewBox="0 0 16 16">
        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5Zm-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5ZM4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5Z"/>
    </svg>
);

// Стили для календаря. Можно вынести в отдельный CSS-файл.
const styles = `
.pnl-calendar-container .modal {
    display: block;
    background-color: rgba(0, 0, 0, 0.7);
}
.pnl-calendar-container .modal-content {
    background-color: #161B22;
    border: 1px solid #30363D;
}
.pnl-calendar-container .modal-body {
    max-height: 60vh;
    overflow-y: auto;
}
.pnl-calendar-container {
    background-color: rgba(31, 41, 59, 0.5);
    border: 1px solid #30363D;
    border-radius: 16px;
    padding: 1.5rem;
    color: white;
}
.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}
.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
}
.day-name {
    text-align: center;
    font-weight: bold;
    color: #9CA3AF;
    padding-bottom: 10px;
}
.calendar-day {
    border: 1px solid #30363D;
    border-radius: 8px;
    min-height: 85px;
    padding: 5px;
    transition: all 0.3s;
}
.calendar-day.blank {
    background-color: transparent;
    border: 1px solid transparent;
}
.day-number {
    font-size: 0.8rem;
    color: #9CA3AF;
}
.day-actions {
    position: absolute;
    bottom: 5px;
    right: 5px;
    cursor: pointer;
    opacity: 0.5;
}
.pnl-input {
    width: 100%;
    background-color: transparent;
    border: none;
    color: white;
    text-align: center;
    font-size: 1.3rem;
    font-weight: bold;
    margin-top: 8px;
    outline: none;
}
.pnl-input::placeholder {
    color: #4B5563;
    font-weight: normal;
    font-size: 1rem;
}
.positive {
    background-color: rgba(34, 197, 94, 0.2);
    border-color: rgba(34, 197, 94, 0.5);
}
.negative {
    background-color: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
}
.calendar-day.today {
    border-color: #38BDF8;
    box-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
}
`;
const PnlPge = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [pnlData, setPnlData] = useState(() => {
        const savedData = localStorage.getItem('pnlData');
        return savedData ? JSON.parse(savedData) : {};
    });

    // Состояния для модального окна
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [newTrade, setNewTrade] = useState({ asset: '', entry: '', exit: '', leverage: '1' });
    const [editingTradeId, setEditingTradeId] = useState(null); // Для редактирования сделки

    useEffect(() => {
        localStorage.setItem('pnlData', JSON.stringify(pnlData));
    }, [pnlData]);

    const openModal = (dateStr) => {
        setSelectedDate(dateStr);
        setNewTrade({ asset: '', entry: '', exit: '', leverage: '1' }); // Сброс формы
        setEditingTradeId(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDate(null);
    };

    const handleEditTrade = (trade) => {
        setNewTrade(trade); // Загружаем данные сделки в форму
        setEditingTradeId(trade.id); // Устанавливаем ID для режима редактирования
    };

    const handleModalChange = (e) => {
        const { name, value } = e.target; // Используем newTrade для новой сделки
        setNewTrade(prev => ({ ...prev, [name]: value }));
    };

    // --- НОВАЯ ЛОГИКА СОХРАНЕНИЯ СДЕЛКИ ---
    const handleAddOrUpdateTrade = () => {
        if (!selectedDate) return;

        const { entry, exit, leverage } = newTrade;
        const entryNum = parseFloat(entry);
        const exitNum = parseFloat(exit);
        const leverageNum = parseFloat(leverage) || 1;

        if (isNaN(entryNum) || isNaN(exitNum) || entryNum === 0) {
            alert("Пожалуйста, введите корректные цены входа и выхода.");
            return;
        }

        const pnl = ((exitNum - entryNum) / entryNum) * leverageNum * 100;
        const tradeToSave = { ...newTrade, pnl: pnl.toFixed(2), id: editingTradeId || Date.now().toString() };

        setPnlData(prev => {
            const dayData = prev[selectedDate];
            let newTrades = [];

            if (dayData && dayData.type === 'advanced') {
                if (editingTradeId) { // Обновляем существующую
                    newTrades = dayData.trades.map(t => t.id === editingTradeId ? tradeToSave : t);
                } else { // Добавляем новую
                    newTrades = [...dayData.trades, tradeToSave];
                }
            } else { // Это первая сделка за день
                newTrades = [tradeToSave];
            }

            return {
                ...prev,
                [selectedDate]: { type: 'advanced', trades: newTrades }
            };
        });

        // Сброс формы и выход из режима редактирования
        setNewTrade({ asset: '', entry: '', exit: '', leverage: '1' });
        setEditingTradeId(null);
    };

    const handleDeleteTrade = (dateStr, tradeId) => {
        setPnlData(prev => {
            const dayData = prev[dateStr];
            if (!dayData || dayData.type !== 'advanced') return prev;

            const updatedTrades = dayData.trades.filter(t => t.id !== tradeId);

            // Если сделок не осталось, можно удалить запись за день
            if (updatedTrades.length === 0) {
                const { [dateStr]: _, ...rest } = prev;
                return rest;
            }

            return { ...prev, [dateStr]: { ...dayData, trades: updatedTrades } };
        });
    };

    const handleSimplePnlChange = (date, value) => { // Теперь это отдельный режим
        const numericValue = value.replace(/[^0-9.-]/g, '');
        setPnlData(prevData => ({
            ...prevData,
            [date]: {
                type: 'simple',
                value: numericValue
            }
        }));
    };

    const changeMonth = (offset) => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate);
            newDate.setMonth(newDate.getMonth() + offset);
            return newDate;
        });
    };

    const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let startingDay = firstDayOfMonth.getDay() - 1;

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    if (startingDay === -1) startingDay = 6; // Воскресенье

    const calendarDays = Array.from({ length: startingDay + daysInMonth }, (_, i) => {
        if (i < startingDay) {
            return <div key={`blank-${i}`} className="calendar-day blank"></div>;
        }
        const day = i - startingDay + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = pnlData[dateStr];

        let pnlDisplay = '';
        let pnlNum = NaN;

        if (dayData) {
            if (dayData.type === 'simple') {
                pnlNum = parseFloat(dayData.value);
                pnlDisplay = isNaN(pnlNum) ? '' : `${pnlNum.toFixed(2)}%`;
            } else if (dayData.type === 'advanced') {
                // Суммируем PNL всех сделок за день
                pnlNum = (dayData.trades || []).reduce((sum, trade) => sum + parseFloat(trade.pnl), 0);
                pnlDisplay = isNaN(pnlNum) ? '' : `${pnlNum.toFixed(2)}%`;
            }
        }

        let dayClass = 'calendar-day';
        if (pnlNum > 0) dayClass += ' positive';
        if (pnlNum < 0) dayClass += ' negative';
        if (dateStr === todayStr) dayClass += ' today';

        return (
            <div key={dateStr} className={`${dayClass} position-relative`}>
                <div className="day-number">{day}</div>
                {dayData?.type === 'advanced' ? ( // Если есть сделки
                    <div className="pnl-input" onClick={() => openModal(dateStr)}>
                        {pnlDisplay}
                        <div className="day-actions"><EyeIcon /></div>
                    </div>
                ) : ( // Если простой PNL или пусто
                    <>
                        <input
                            type="text"
                            className="pnl-input"
                            placeholder="%"
                            value={dayData?.value || ''}
                            onChange={(e) => handleSimplePnlChange(dateStr, e.target.value)}
                            onBlur={(e) => e.target.value && handleSimplePnlChange(dateStr, parseFloat(e.target.value).toFixed(2))}
                        />
                        <div className="day-actions" onClick={() => openModal(dateStr)}><PlusIcon /></div>
                    </>
                )}
            </div>
        );
    });

    return (
        <div className="pnl-calendar-container">
            <style>{styles}</style>
            <div className="calendar-header">
                <button className="btn btn-outline-light" onClick={() => changeMonth(-1)}>‹ Пред.</button>
                <h3 className="fw-bold mb-0">{currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}</h3>
                <button className="btn btn-outline-light" onClick={() => changeMonth(1)}>След. ›</button>
            </div>
            <div className="calendar-grid">
                {daysOfWeek.map(day => <div key={day} className="day-name">{day}</div>)}
                {calendarDays}
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header border-bottom-0">
                                <h5 className="modal-title">Запись за {selectedDate}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body">
                                {/* Список существующих сделок */}
                                {pnlData[selectedDate]?.type === 'advanced' && pnlData[selectedDate].trades.length > 0 && (
                                    <div className="mb-4">
                                        <h6 className="mb-3">Сохраненные сделки:</h6>
                                        {pnlData[selectedDate].trades.map(trade => (
                                            <div key={trade.id} className="d-flex justify-content-between align-items-center p-2 rounded mb-2" style={{backgroundColor: '#0D1117', cursor: 'pointer'}} onClick={() => handleEditTrade(trade)}>
                                                <div>
                                                    <span className="fw-bold">{trade.asset}</span>
                                                    <small className={`ms-2 ${parseFloat(trade.pnl) >= 0 ? 'text-success' : 'text-danger'}`}>
                                                        {parseFloat(trade.pnl).toFixed(2)}%
                                                    </small>
                                                </div>
                                                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteTrade(selectedDate, trade.id)}>
                                                    <TrashIcon />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Форма добавления новой сделки */}
                                <h6 className="mb-3">{editingTradeId ? 'Редактировать сделку' : 'Добавить новую сделку'}</h6>
                                <div className="mb-3">
                                    <label className="form-label">Актив</label>
                                    <input type="text" name="asset" value={newTrade.asset} onChange={handleModalChange} className="form-control" placeholder="Например: BTC/USDT" />
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <label className="form-label">Вход</label>
                                        <input type="number" name="entry" value={newTrade.entry} onChange={handleModalChange} className="form-control" placeholder="69000" />
                                    </div>
                                    <div className="col">
                                        <label className="form-label">Выход</label>
                                        <input type="number" name="exit" value={newTrade.exit} onChange={handleModalChange} className="form-control" placeholder="70000" />
                                    </div>
                                    <div className="col">
                                        <label className="form-label">Плечо</label>
                                        <input type="number" name="leverage" value={newTrade.leverage} onChange={handleModalChange} className="form-control" placeholder="10" />
                                    </div>
                                </div>
                                <div className="d-grid mt-3">
                                    <button type="button" className="btn btn-primary" onClick={handleAddOrUpdateTrade}>
                                        {editingTradeId ? 'Обновить сделку' : 'Добавить сделку'}
                                    </button>
                                </div>

                            </div>
                            <div className="modal-footer justify-content-center">
                                <p className="small text-muted mb-0">
                                    Или <button className="btn btn-link p-0" onClick={closeModal}>закрыть окно</button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PnlPge;