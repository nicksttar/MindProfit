// src/pages/CurrentProjectsView.js
import React from 'react';

const CurrentProjectsView = ({ userId }) => {
    return (
        <div className="text-center p-5 action-card">
            <h4 className="fw-bold">🚀 Актуальные проекты</h4>
            <p style={{ color: '#9CA3AF' }}>Этот раздел находится в разработке. Здесь будет информация о перспективных проектах и airdrop-кампаниях.</p>
            <button className="btn btn-primary" disabled>Скоро</button>
        </div>
    );
};

export default CurrentProjectsView;