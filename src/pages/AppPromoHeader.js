export default function AppHeader({ activeView, setActiveView, onLogout }) {
  return (
    <header className="app-header">
      <div className="container-xl d-flex justify-content-between align-items-center">
        <h4 className="logo mb-0">Mind Profit</h4>
        <nav className="main-nav">
          <button className={`nav-button ${activeView === "dashboard" ? "active" : ""}`} onClick={() => setActiveView("dashboard")}>Портфели</button>
          <button className={`nav-button ${activeView === "academy" ? "active" : ""}`} onClick={() => setActiveView("academy")}>Академия</button>
          <button className={`nav-button ${activeView === "settings" ? "active" : ""}`} onClick={() => setActiveView("settings")}>Настройки</button>
        </nav>
        <button className="logout-btn-header" onClick={onLogout}>Выйти <i className="bi bi-box-arrow-right"></i></button>
      </div>
    </header>
  );
}