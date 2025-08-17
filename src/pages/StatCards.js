// src/components/StatCards.js

import React from 'react';

const StatCards = ({ portfolioCount }) => {
    return (
        <div className="row mb-5">
            <div className="col-lg-4 col-md-6 mb-4">
                <div className="stat-card">
                    <h6 className="card-title">Текущий баланс</h6>
                    <p className="card-value">$1,250.00</p>
                </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
                <div className="stat-card">
                    <h6 className="card-title">Активных портфелей</h6>
                    <p className="card-value">{portfolioCount}</p>
                </div>
            </div>
            <div className="col-lg-4 col-md-12 mb-4">
                <div className="stat-card">
                    <h6 className="card-title">Доход за месяц</h6>
                    <p className="card-value text-success">+$84.50</p>
                </div>
            </div>
        </div>
    );
};

export default StatCards;
