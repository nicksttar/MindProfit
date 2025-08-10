import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExchangeConnect() {
  const [kycChecked, setKycChecked] = useState(false);
  const navigate = useNavigate();

  const handleConnect = () => {
    if (!kycChecked) {
      alert("Пожалуйста, подтвердите прохождение KYC.");
      return;
    }
    // Здесь может быть логика подключения к FastConnect / OAuth
    navigate("/dashboard/ready-portfolios");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #f8f9fa, #e0e7ff)",
        paddingTop: "70px"
      }}
    >
      <div className="bg-white p-5 rounded shadow text-dark" style={{ maxWidth: "650px", width: "100%" }}>
        <h4 className="text-center fw-bold mb-4">Подключите биржу</h4>

        <div className="text-center mb-4">
          <img src="/img/okx.png" alt="OKX" style={{ height: "40px" }} />
        </div>

        <h5 className="fw-bold text-center mb-3">Это просто!</h5>
        <ul className="list-unstyled text-center mb-4">
          <li><strong>Шаг 1:</strong> Нажмите на кнопку «Connect».</li>
          <li><strong>Шаг 2:</strong> Войдите в свой аккаунт OKX.</li>
          <li><strong>Шаг 3:</strong> Подтвердите ваше соединение.</li>
        </ul>

        <div className="bg-light border p-3 rounded mb-4 small">
          <p className="mb-1">Перед подключением убедитесь:</p>
          <ul className="mb-0 ps-3">
            <li>Вы прошли процедуру KYC на бирже.</li>
            <li>У вас есть не менее $15 на спотовом счете.</li>
          </ul>
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            checked={kycChecked}
            onChange={() => setKycChecked(!kycChecked)}
            id="kycCheck"
          />
          <label className="form-check-label" htmlFor="kycCheck">
            Я прошел KYC на бирже
          </label>
        </div>

        <button
          className="btn btn-primary w-100 mb-3"
          onClick={handleConnect}
        >
          ПОДКЛЮЧИТЬ ЧЕРЕЗ FAST CONNECT
        </button>

        <div className="text-center">
          <a href="#" className="text-decoration-none small">
            Не получилось через FastConnect? Попробовать вручную →
          </a>
        </div>
      </div>
    </div>
  );
}
