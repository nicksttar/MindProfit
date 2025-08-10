// src/pages/Dashboard.js

import React from 'react';
import '../App.css'; // Подключаем общие стили

// Убедитесь, что пути к этим компонентам верны
import PortfolioView from './PortfolioView';
import AcademyView from './AcademyView';
import SettingsView from './SettingsView';

/**
 * Контейнер для содержимого панели управления.
 * ИЗМЕНЕНО: Теперь принимает userId и передает его в PortfolioView.
 */
export default function Dashboard({ activeView, userId, setUserId }) {
  return (
    <main className="container-xl" style={{ paddingTop: "100px", paddingBottom: "50px" }}>
      {/* Условный рендеринг компонента в зависимости от activeView */}
      {activeView === 'dashboard' && <PortfolioView userId={userId} />}
      {activeView === 'academy' && <AcademyView />}
      {activeView === 'settings' && <SettingsView userId={userId} setUserId={setUserId} />}
    </main>
  );
}
