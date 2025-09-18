// src/pages/MainView.js

import React, { useState } from 'react';
import PortfolioView from './PortfolioView';
import SignalsView from './SignalsView';
import PineScripts from './PineScripts';
import CurrentProjectsView from './CurrentProjectsView'
import PnlPge from './Pnl';
import '../App.css'; // Убедитесь, что стили подключены

const MainView = ({ userId }) => {
    // Состояние для отслеживания активной вкладки. 'portfolios' - вкладка по умолчанию.
    const [activeTab, setActiveTab] = useState('portfolios');

    // Функция для отрисовки контента в зависимости от активной вкладки
    const renderContent = () => {
        switch (activeTab) {
            case 'portfolios':
                return <PortfolioView userId={userId} />;
            case 'signals':
                return <SignalsView userId={userId} />;
            case 'pine-scripts':
                return <PineScripts />;
            case 'projects':
                return <CurrentProjectsView userId={userId} />;
            case 'pnl':
                return <PnlPge userId={userId} />;
            default:
                return <PortfolioView userId={userId} />;
        }
    };

    // Функция для применения стилей к активной вкладке
    const getTabClassName = (tabName) => {
        return `nav-link ${activeTab === tabName ? 'active' : ''}`;
    };

    return (
        <div>
            <div className="text-center mb-5 segmented-control">
                <h2 className="fw-bold">👋 Добро пожаловать!</h2>
                <p className="lead" style={{ color: '#9CA3AF' }}>Ваш центр управления инвестициями и трейдингом.</p>
            </div>

            {/* Навигация по вкладкам */}
<ul className="nav nav-tabs mb-4 d-flex justify-content-center segmented-control">
    <li className="nav-item">
        <button className={getTabClassName('portfolios')} onClick={() => setActiveTab('portfolios')}>
            Портфели
        </button>
    </li>
    <li className="nav-item">
        <button className={getTabClassName('signals')} onClick={() => setActiveTab('signals')}>
            Сигналы
        </button>
    </li>
    <li className="nav-item">
        <button className={getTabClassName('pnl')} onClick={() => setActiveTab('pnl')}>
            PNL
        </button>
    </li>
    <li className="nav-item">
        <button className={getTabClassName('pine-scripts')} onClick={() => setActiveTab('pine-scripts')}>
            Pine Scripts
        </button>
    </li>
    <li className="nav-item">
        <button className={getTabClassName('projects')} onClick={() => setActiveTab('projects')}>
            Актуальные проекты
        </button>
    </li>
</ul>

            {/* Контент активной вкладки */}
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default MainView;