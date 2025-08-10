// App.js

import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";

// Убедитесь, что все эти файлы существуют в папке /pages
import Home from "./pages/Home";
import Invest from "./pages/Invest";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// --- Компонент для защиты маршрутов ---
function ProtectedRoute({ userId, children }) {
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// --- Шапка для публичных страниц ---
function PublicHeader() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <header className="app-header">
      <div className="container-xl d-flex justify-content-between align-items-center">
        <Link to="/" className="logo text-decoration-none fs-4">
          Mind Profit
        </Link>
        <nav className="d-none d-md-flex align-items-center gap-2">
          <Link to="/" className={`nav-button ${isActive('/') ? 'active' : ''}`}>
            Главная
          </Link>
          <Link to="/invest" className={`nav-button ${isActive('/invest') ? 'active' : ''}`}>
            Инвестировать
          </Link>
          <Link to="/pricing" className={`nav-button ${isActive('/pricing') ? 'active' : ''}`}>
            Цены
          </Link>
          <Link to="/help" className={`nav-button ${isActive('/help') ? 'active' : ''}`}>
            Помощь
          </Link>
        </nav>
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-light">
            Вход
          </Link>
          <Link to="/register" className="btn btn-primary">
            Регистрация
          </Link>
        </div>
      </div>
    </header>
  );
}


// --- Шапка для панели управления ---
function AppHeader({ activeView, setActiveView, onLogout }) {
  return (
    <header className="app-header">
      <div className="container-xl d-flex justify-content-between align-items-center">
        <h4 className="logo mb-0" role="button" onClick={() => setActiveView("dashboard") }>Mind Profit</h4>
        <nav className="main-nav">
          <button className={`nav-button ${activeView === "dashboard" ? "active" : ""}`} onClick={() => setActiveView("dashboard")}>Портфели</button>
          <button className={`nav-button ${activeView === "academy" ? "active" : ""}`} onClick={() => setActiveView("academy")}>Академия</button>
          <button className={`nav-button ${activeView === "settings" ? "active" : ""}`} onClick={() => setActiveView("settings")}>Настройки</button>
        </nav>
        <button className="logout-btn-header" onClick={onLogout}>Выйти</button>
      </div>
    </header>
  );
}

// --- ИЗМЕНЕНО: Футер вынесен в отдельный компонент ---
function Footer() {
    return (
        <footer className="py-4 px-4 border-top" style={{ background: '#0D1117', borderColor: '#30363D' }}>
            <div className="container-xl d-flex flex-column flex-md-row justify-content-between align-items-center">
                <div className="mb-3 mb-md-0 small text-center text-md-start">
                    © 2025 Mind Profit. All rights reserved.
                </div>
                <div className="d-flex gap-3 flex-wrap justify-content-center">
                    <Link to="/privacy" className="text-decoration-none small" style={{ color: '#9CA3AF' }}>Политика конфиденциальности</Link>
                    <Link to="/terms" className="text-decoration-none small" style={{ color: '#9CA3AF' }}>Условия использования</Link>
                </div>
            </div>
        </footer>
    );
}


// --- ОСНОВНОЙ МАКЕТ ПРИЛОЖЕНИЯ ---
function AppLayout() {
  const [userId, setUserId] = useState(localStorage.getItem('mindProfitUserId'));
  const [activeDashboardView, setActiveDashboardView] = useState('dashboard');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = (newUserId) => {
    localStorage.setItem('mindProfitUserId', newUserId);
    setUserId(newUserId);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('mindProfitUserId');
    setUserId(null);
    navigate('/');
  };

  const isDashboardPage = location.pathname.startsWith("/dashboard");

  // ИЗМЕНЕНО: Логика отображения шапки и футера
  const HeaderComponent = isDashboardPage ? 
    <AppHeader activeView={activeDashboardView} setActiveView={setActiveDashboardView} onLogout={handleLogout} /> :
    <PublicHeader />;

  return (
    <div className="dashboard-container min-vh-100 d-flex flex-column">
      {HeaderComponent}
      {/* ИЗМЕНЕНО: paddingTop теперь зависит только от того, дашборд ли это */}
      <main className="flex-grow-1 w-100 d-flex flex-column" style={{ paddingTop: !isDashboardPage ? '80px' : '0' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/help" element={<Help />} />
          <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} onToggle={() => navigate('/login')} />} />
          <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} onToggle={() => navigate('/register')} />} />
          <Route path="/dashboard/*" element={
            <ProtectedRoute userId={userId}>
              <Dashboard activeView={activeDashboardView} setActiveView={setActiveDashboardView} userId={userId} setUserId={setUserId} />
            </ProtectedRoute>
          }/>
        </Routes>
      </main>
      {/* ИЗМЕНЕНО: Футер отображается на всех не-дашборд страницах */}
      {!isDashboardPage && !Home && <Footer />}
    </div>
  );
}

// --- Главный компонент приложения ---
export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
