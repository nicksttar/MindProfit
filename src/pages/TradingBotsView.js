// src/pages/TradingBotsView.js
import React from 'react';

const TradingBotsView = ({ userId }) => {
    return (
        <div className="text-center p-5 action-card">
            <h4 className="fw-bold">🤖 Трейдинг боты</h4>
            <p style={{ color: '#9CA3AF' }}>Этот раздел находится в разработке. Здесь вы сможете настраивать и запускать автоматизированных торговых ботов.</p>
            <button className="btn btn-primary" disabled>Скоро</button>
        </div>
    );
};

export default TradingBotsView;