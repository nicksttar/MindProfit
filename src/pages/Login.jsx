import { useState, useEffect } from "react";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";

// Иконка для визуального акцента
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#9CA3AF' }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
);


export default function Login({ onLoginSuccess, onToggle }) { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 500, once: true });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", {
        email,
        password,
      });
      if (res.data.success) {
        onLoginSuccess(res.data.userId); 
      }
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-container d-flex align-items-center justify-content-center flex-grow-1">
      <form
        onSubmit={handleLogin}
        className="stat-card p-4 p-md-5" // ИЗМЕНЕНО: Увеличены отступы
        style={{ width: "100%", maxWidth: "420px" }}
        data-aos="fade-up" // ИЗМЕНЕНО: Добавлена анимация
      >
        <div className="text-center mb-4">
            <LockIcon />
        </div>
        <h2 className="text-center fw-bold mb-4">Вход в Mind Profit</h2>
        
        {error && 
          <div 
            className="text-center p-2 mb-3 rounded" 
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          >
            {error}
          </div>
        }

        <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">Email</label>
            <input
                id="emailInput"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>

        <div className="mb-3">
            <label htmlFor="passwordInput" className="form-label">Пароль</label>
            <input
                id="passwordInput"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>
        
        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isLoading}>
          {isLoading ? "Входим..." : "Войти"}
        </button>

        <p className="text-center mt-4 mb-0" style={{ color: '#9CA3AF' }}>
          Еще нет аккаунта?{' '}
          <button 
            type="button" 
            onClick={onToggle} 
            className="btn btn-link p-0 align-baseline" 
            style={{ color: '#38BDF8', textDecoration: 'none', fontWeight: 'bold' }}
          >
            Зарегистрироваться
          </button>
        </p>
      </form>
    </div>
  );
}
