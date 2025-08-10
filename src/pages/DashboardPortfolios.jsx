import { useState } from "react";

const predefinedPortfolios = [
  {
    id: "mindex",
    name: "M-Index",
    description: "Топ-25 криптовалют с ежемесячным ребалансом. Оптимально для долгосрочных инвестиций.",
  },
  {
    id: "defi",
    name: "DeFi",
    description: "Фокус на децентрализованные финансы — высокие риски и высокая потенциальная доходность.",
  },
  {
    id: "memes",
    name: "Мемы",
    description: "Самые хайповые монеты интернета. Весело, но опасно.",
  },
];

export default function DashboardPortfolios() {
  const [mode, setMode] = useState("choose"); // choose | create

  return (
    <div className="container text-light py-5">
      <h2 className="fw-bold text-center mb-4">Управление портфелями</h2>
      <div className="d-flex justify-content-center gap-3 mb-4">
        <button
          className={`btn ${mode === "choose" ? "btn-success" : "btn-outline-light"}`}
          onClick={() => setMode("choose")}
        >
          Выбрать готовый
        </button>
        <button
          className={`btn ${mode === "create" ? "btn-success" : "btn-outline-light"}`}
          onClick={() => setMode("create")}
        >
          Создать вручную
        </button>
      </div>

      {mode === "choose" ? (
        <div className="row">
          {predefinedPortfolios.map((p) => (
            <div key={p.id} className="col-md-4 mb-4">
              <div className="card h-100 bg-dark text-light border-0 shadow">
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">{p.description}</p>
                  <button className="btn btn-success w-100">Выбрать</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-dark p-4 rounded shadow">
          <h4 className="fw-bold mb-3">Создание собственного портфеля</h4>
          <p className="mb-3">Выберите монеты, которые вы хотите добавить в свой портфель:</p>
          {/* Тут позже можно добавить форму с чекбоксами или инпутами */}
          <div className="form-group mb-3">
            <label className="form-label">Название портфеля</label>
            <input type="text" className="form-control" placeholder="Например, My Portfolio" />
          </div>
          <div className="alert alert-secondary text-muted">
            Выбор монет будет доступен после интеграции с базой данных.
          </div>
          <button className="btn btn-outline-success">Создать</button>
        </div>
      )}
    </div>
  );
}
