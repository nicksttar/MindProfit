import { useState } from "react";
import axios from "axios";

// Принимаем onRegisterSuccess и onToggle из App.js
export default function Register({ onRegisterSuccess, onToggle }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/register", {
        email,
        password,
      });

      if (res.data.success) {
        onRegisterSuccess(res.data.userId);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // ИЗМЕНЕНО: Структура и классы приведены в соответствие с формой входа
    <div className="dashboard-container d-flex align-items-center justify-content-center flex-grow-1">
      {/* ИЗМЕНЕНО: Форма стилизована с помощью класса .stat-card */}
      <form
        onSubmit={handleSubmit}
        className="stat-card"
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <h2 className="text-center fw-bold mb-4">Регистрация</h2>
        
        {/* ИЗМЕНЕНО: Стиль ошибки как на странице входа */}
        {error && 
          <div 
            className="text-center p-2 mb-3 rounded" 
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          >
            {error}
          </div>
        }

        {/* ИЗМЕНЕНО: Поля ввода сгруппированы с <label> */}
        <div className="mb-3">
            <label htmlFor="regEmail" className="form-label">Email</label>
            <input
                id="regEmail"
                type="email"
                className="form-control"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
        </div>

        <div className="mb-3">
            <label htmlFor="regPassword" className="form-label">Пароль</label>
            <input
                id="regPassword"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
        </div>

        <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Повторите пароль</label>
            <input
                id="confirmPassword"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
        </div>
        
        {/* ИЗМЕНЕНО: Кнопка стилизована с помощью .btn-primary */}
        <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <p className="text-center mt-4 mb-0" style={{ color: '#9CA3AF' }}>
          Уже есть аккаунт?{' '}
          {/* ИЗМЕНЕНО: Ссылка сделана в виде кнопки */}
          <button 
            type="button" 
            onClick={onToggle} 
            className="btn btn-link p-0 align-baseline" 
            style={{ color: '#38BDF8', textDecoration: 'none' }}
          >
            Войти
          </button>
        </p>
      </form>
    </div>
  );
}
