// App.js

import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

// --- Импортируем страницы ---
import Home from "./pages/Home";
import Invest from "./pages/Invest";
import Pricing from "./pages/Pricing";
import Help from "./pages/Help";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel"; // <-- НОВОЕ: Импортируем админ-панель

// --- НОВОЕ: Компонент для страницы входа админа ---
function AdminLogin({ onLoginSuccess }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === '11111111') {
            onLoginSuccess();
        } else {
            setError('Неверный пароль');
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 150px)' }}>
            <div className="col-md-6 col-lg-4">
                <div className="card p-4">
                    <h3 className="text-center mb-4">Вход для администратора</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="password">Пароль</label>
                            <input
                                type="password"
                                className="form-control"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-danger small">{error}</p>}
                        <button type="submit" className="btn btn-primary w-100">Войти</button>
                    </form>
                </div>
            </div>
        </div>
    );
}


// --- Компонент для защиты маршрутов пользователя ---
function ProtectedRoute({ userId, children }) {
  if (!userId) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// --- НОВОЕ: Компонент для защиты маршрутов админа ---
function AdminProtectedRoute({ isAdmin, children }) {
    if (!isAdmin) {
        return <Navigate to="/admin-login" replace />;
    }
    return children;
}


// --- Шапка для публичных страниц ---
function PublicHeader() {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

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


    const closeMenu = () => setIsMenuOpen(false);

    return (
        <header className="app-header">
            <div className="container-xl d-flex justify-content-between align-items-center h-100">
                <Link to="/" className="logo text-decoration-none fs-4">
                    Mind Profit
                </Link>
                <nav className="d-none d-md-flex align-items-center gap-2">
                    <Link to="/" className={`nav-button ${isActive('/') ? 'active' : ''}`}>Главная</Link>
                    <Link to="/invest" className={`nav-button ${isActive('/invest') ? 'active' : ''}`}>Инвестировать</Link>
                    <Link to="/pricing" className={`nav-button ${isActive('/pricing') ? 'active' : ''}`}>Цены</Link>
                    <Link to="/help" className={`nav-button ${isActive('/help') ? 'active' : ''}`}>Помощь</Link>
                </nav>
                <div className="d-none d-md-flex gap-2">
                    <Link to="/login" className="btn btn-outline-light">Вход</Link>
                    <Link to="/register" className="btn btn-primary">Регистрация</Link>
                </div>
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
            <div
                className="d-md-none"
                style={{
                    position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0,
                    backgroundColor: '#0D1117', zIndex: 1000, display: 'flex',
                    flexDirection: 'column', alignItems: 'center', padding: '2rem',
                    gap: '1.5rem', transition: 'transform 0.3s ease-in-out',
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
                <nav className="main-nav d-none d-md-flex align-items-center gap-2">
                    <button className={`nav-button ${activeView === "dashboard" ? "active" : ""}`} onClick={() => setActiveView("dashboard")}>Портфели</button>
                    <button className={`nav-button ${activeView === "academy" ? "active" : ""}`} onClick={() => setActiveView("academy")}>Академия</button>
                    <button className={`nav-button ${activeView === "settings" ? "active" : ""}`} onClick={() => setActiveView("settings")}>Настройки</button>
                </nav>
                <button className="logout-btn-header d-none d-md-block" onClick={onLogout}>Выйти</button>
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
            <div
                className="d-md-none"
                style={{
                    position: 'fixed', top: '72px', left: 0, right: 0, bottom: 0,
                    backgroundColor: '#0D1117', zIndex: 1000, display: 'flex',
                    flexDirection: 'column', alignItems: 'center', padding: '2rem',
                    gap: '1.5rem', transition: 'transform 0.3s ease-in-out',
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
    // НОВОЕ: Состояние для аутентификации админа. Используем sessionStorage, чтобы сессия сбрасывалась при закрытии вкладки.
    const [isAdmin, setIsAdmin] = useState(sessionStorage.getItem('isAdminAuthenticated') === 'true');
    const [activeDashboardView, setActiveDashboardView] = useState('dashboard');
    const navigate = useNavigate();
    const location = useLocation();

    const handleLoginSuccess = (newUserId) => {
        localStorage.setItem('mindProfitUserId', newUserId);
        setUserId(newUserId);
        navigate('/dashboard');
    };

    // НОВОЕ: Функция для успешного входа админа
    const handleAdminLoginSuccess = () => {
        sessionStorage.setItem('isAdminAuthenticated', 'true');
        setIsAdmin(true);
        navigate('/admin');
    };

    const handleLogout = () => {
        localStorage.removeItem('mindProfitUserId');
        setUserId(null);
        navigate('/');
    };

    const isDashboardPage = location.pathname.startsWith("/dashboard");
    const isPublicPage = !isDashboardPage && location.pathname !== '/admin' && location.pathname !== '/admin-login';

    const HeaderComponent = isDashboardPage ?
        <AppHeader activeView={activeDashboardView} setActiveView={setActiveDashboardView} onLogout={handleLogout} /> :
        isPublicPage ? <PublicHeader /> : null; // Не показываем шапку на страницах админки

    return (
        <div className="dashboard-container min-vh-100 d-flex flex-column">
            {HeaderComponent}
            <main className="flex-grow-1 w-100 d-flex flex-column" style={{ paddingTop: isPublicPage ? '80px' : '0' }}>
                <Routes>
                    {/* Публичные роуты */}
                    <Route path="/" element={<Home />} />
                    <Route path="/invest" element={<Invest />} />
                    <Route path="/pricing" element={<Pricing />} />
                    <Route path="/help" element={<Help />} />
                    <Route path="/register" element={<Register onRegisterSuccess={handleLoginSuccess} onToggle={() => navigate('/login')} />} />
                    <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} onToggle={() => navigate('/register')} />} />
                    
                    {/* Роуты админки */}
                    <Route path="/admin-login" element={<AdminLogin onLoginSuccess={handleAdminLoginSuccess} />} />
                    <Route path="/admin" element={
                        <AdminProtectedRoute isAdmin={isAdmin}>
                            <AdminPanel />
                        </AdminProtectedRoute>
                    }/>

                    {/* Защищенный роут пользователя */}
                    <Route path="/dashboard/*" element={
                        <ProtectedRoute userId={userId}>
                            <Dashboard activeView={activeDashboardView} setActiveView={setActiveDashboardView} userId={userId} setUserId={setUserId} />
                        </ProtectedRoute>
                    }/>
                </Routes>
            </main>
            {isPublicPage && <Footer />}
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
