// src/pages/SignalsView.js
import React from 'react';

const SignalsView = ({ userId }) => {
    return (
        <div className="text-center p-5 action-card">
            <h4 className="fw-bold">📢 Торговые сигналы</h4>
            <p style={{ color: '#9CA3AF' }}>Этот раздел находится в разработке. Здесь будут отображаться актуальные сигналы для ваших торговых стратегий.</p>
            <button className="btn btn-primary" disabled>Скоро</button>
        </div>
    );
};

export default SignalsView;