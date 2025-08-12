// App.js

import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

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
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Закрывать меню при изменении маршрута
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    // Блокировка прокрутки фона при открытом меню
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        // Очистка при размонтировании компонента
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);


    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="app-header">
            <div className="container-xl d-flex justify-content-between align-items-center h-100">
                <Link to="/" className="logo text-decoration-none fs-4">
                    Mind Profit
                </Link>

                {/* Навигация для десктопа */}
                <nav className="d-none d-md-flex align-items-center gap-2">
                    <Link to="/" className={`nav-button ${isActive('/') ? 'active' : ''}`}>Главная</Link>
                    <Link to="/invest" className={`nav-button ${isActive('/invest') ? 'active' : ''}`}>Инвестировать</Link>
                    <Link to="/pricing" className={`nav-button ${isActive('/pricing') ? 'active' : ''}`}>Цены</Link>
                    <Link to="/help" className={`nav-button ${isActive('/help') ? 'active' : ''}`}>Помощь</Link>
                </nav>

                {/* Кнопки входа для десктопа */}
                <div className="d-none d-md-flex gap-2">
                    <Link to="/login" className="btn btn-outline-light">Вход</Link>
                    <Link to="/register" className="btn btn-primary">Регистрация</Link>
                </div>

                {/* Кнопка бургер-меню для мобильных */}
                <button
                    className="d-md-none btn p-1"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation"
                    style={{ border: 'none' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        {isMenuOpen ? (
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                        ) : (
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Мобильное меню (оверлей) */}
            <div
                className="d-md-none"
                style={{
                    position: 'fixed',
                    top: '72px', // Высота шапки
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#0D1117',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem',
                    gap: '1.5rem',
                    transition: 'transform 0.3s ease-in-out',
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                }}
            >
                <Link to="/" className={`nav-button fs-4 ${isActive('/') ? 'active' : ''}`} onClick={closeMenu}>Главная</Link>
                <Link to="/invest" className={`nav-button fs-4 ${isActive('/invest') ? 'active' : ''}`} onClick={closeMenu}>Инвестировать</Link>
                <Link to="/pricing" className={`nav-button fs-4 ${isActive('/pricing') ? 'active' : ''}`} onClick={closeMenu}>Цены</Link>
                <Link to="/help" className={`nav-button fs-4 ${isActive('/help') ? 'active' : ''}`} onClick={closeMenu}>Помощь</Link>
                <div className="d-flex flex-column gap-3 mt-4 w-100 px-4">
                    <Link to="/login" className="btn btn-outline-light btn-lg" onClick={closeMenu}>Вход</Link>
                    <Link to="/register" className="btn btn-primary btn-lg" onClick={closeMenu}>Регистрация</Link>
                </div>
            </div>
        </header>
    );
}


// --- Шапка для панели управления ---
function AppHeader({ activeView, setActiveView, onLogout }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Блокировка прокрутки фона при открытом меню
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const handleViewChange = (view) => {
        setActiveView(view);
        setIsMenuOpen(false);
    };

    const handleLogoutClick = () => {
        setIsMenuOpen(false);
        onLogout();
    }

    return (
        <header className="app-header">
            <div className="container-xl d-flex justify-content-between align-items-center h-100">
                <h4 className="logo mb-0" role="button" onClick={() => handleViewChange("dashboard")}>Mind Profit</h4>

                {/* Навигация для десктопа */}
                <nav className="main-nav d-none d-md-flex align-items-center gap-2">
                    <button className={`nav-button ${activeView === "dashboard" ? "active" : ""}`} onClick={() => setActiveView("dashboard")}>Портфели</button>
                    <button className={`nav-button ${activeView === "academy" ? "active" : ""}`} onClick={() => setActiveView("academy")}>Академия</button>
                    <button className={`nav-button ${activeView === "settings" ? "active" : ""}`} onClick={() => setActiveView("settings")}>Настройки</button>
                </nav>
                <button className="logout-btn-header d-none d-md-block" onClick={onLogout}>Выйти</button>

                {/* Кнопка бургер-меню для мобильных */}
                <button
                    className="d-md-none btn p-1"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle navigation"
                    style={{ border: 'none' }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 16 16">
                        {isMenuOpen ? (
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                        ) : (
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Мобильное меню (оверлей) */}
            <div
                className="d-md-none"
                style={{
                    position: 'fixed',
                    top: '72px', // Высота шапки
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: '#0D1117',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '2rem',
                    gap: '1.5rem',
                    transition: 'transform 0.3s ease-in-out',
                    transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                }}
            >
                <button className={`nav-button fs-4 ${activeView === "dashboard" ? "active" : ""}`} onClick={() => handleViewChange("dashboard")}>Портфели</button>
                <button className={`nav-button fs-4 ${activeView === "academy" ? "active" : ""}`} onClick={() => handleViewChange("academy")}>Академия</button>
                <button className={`nav-button fs-4 ${activeView === "settings" ? "active" : ""}`} onClick={() => handleViewChange("settings")}>Настройки</button>
                <button className="logout-btn-header mt-4 btn-lg" onClick={handleLogoutClick}>Выйти</button>
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
