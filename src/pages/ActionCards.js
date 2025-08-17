// src/components/ActionCards.js

import React from 'react';
// Убедитесь, что путь к ReadyPortfolioWizard корректен
import ReadyPortfolioWizard from './ReadyPortfolioWizard';

const ActionCards = ({
    onGenerate,
    isGenerating,
    generationType,
    userId,
    hasBinanceKeys,
    onPortfolioCreated
}) => {
    return (
        // Убираем 'align-items-start', чтобы Bootstrap мог выровнять карточки по высоте
        <div className="row">
            {/* Карта 1: Выбрать готовый */}
            <div className="col-md-4 mb-4">
                {/* h-100 заставляет карточку занимать всю высоту колонки */}
                <div className="action-card p-4 d-flex flex-column h-100">
                    <h5 className="fw-bold">Выбрать готовый портфель</h5>
                    {/* flex-grow-1 заставляет параграф занимать все доступное место, прижимая кнопку к низу */}
                    <p style={{ color: '#9CA3AF' }} className="mb-4 flex-grow-1">Идеально для новичков, чтобы быстро начать.</p>
                    {userId ? (
                        <ReadyPortfolioWizard
                            userId={userId}
                            hasBinanceKeys={hasBinanceKeys}
                            onPortfolioCreated={onPortfolioCreated}
                        />
                    ) : (
                        <div className="alert alert-warning text-center">
                            Пожалуйста, войдите, чтобы создать портфель.
                        </div>
                    )}
                </div>
            </div>

            {/* Карта 2: Создать собственный */}
            <div className="col-md-4 mb-4">
                <div className="action-card p-4 d-flex flex-column h-100">
                    <h5 className="fw-bold">Создать собственный портфель</h5>
                    <p style={{ color: '#9CA3AF' }} className="mb-4 flex-grow-1">Настройте пропорции под свои цели и уровень риска для полного контроля.</p>
                    <button className="btn btn-outline-light w-100" disabled>
                        🔧 Создать (скоро)
                    </button>
                </div>
            </div>

<div className="col-md-4 mb-4">
    <div className="action-card p-4 d-flex flex-column h-100">
        <h5 className="fw-bold">Сгенерировать крипто-портфель</h5>
        <p style={{ color: '#9CA3AF' }} className="mb-4 flex-grow-1">
            Получите идею для рискового портфеля, состоящего только из криптовалют.
        </p>
        
        {/* --- Начало изменений --- */}
        {/* 1. Добавляем обертку для градиентной рамки */}
        <div className="gradient-button-wrapper">
            {/* 2. Меняем классы у кнопки, чтобы соответствовать новым стилям */}
            <button
                className="btn" 
                onClick={() => onGenerate('crypto')}
                disabled={isGenerating}
            >
                {isGenerating && generationType === 'crypto' ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                    '🔮 Сгенерировать'
                )}
            </button>
        </div>
        {/* --- Конец изменений --- */}

    </div>
</div>
        </div>
    );
};

export default ActionCards;
