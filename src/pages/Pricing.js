import { useState } from "react";
import { Link } from "react-router-dom"; 

export default function Pricing() {
  return (
    <div className="d-flex flex-column" style={{ height: '100%' }}>
      <div className="container-xl flex-grow-1 py-5" style={{ paddingTop: '100px' }}>
        <h2 className="text-center fw-bold mb-3">Выберите план:</h2>
        <p className="lead text-center mb-5 mx-auto" style={{ color: '#9CA3AF', maxWidth: '700px' }}>
          Получайте пассивный доход с криптовалюты без усилий. Mind Profit — это автоматический криптоиндекс с высокой доходностью и полной прозрачностью.
        </p>

        <div className="row justify-content-center align-items-stretch">
          
          {/* FREE */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="stat-card h-100 d-flex flex-column p-4">
              <h4 className="fw-bold">Бесплатный</h4>
              <h2 style={{ color: '#38BDF8' }}>$0</h2>
              <p className="mb-4" style={{ color: '#9CA3AF' }}>Навсегда</p>
              {/* ИЗМЕНЕНО: Обновлен список возможностей */}
              <ul className="list-unstyled mb-4" style={{ color: '#E5E7EB', flexGrow: 1 }}>
                <li className="mb-2">✔ Сумма до $300</li>
                <li className="mb-2">✔ 1 портфель</li>
                <li className="mb-2">✔ Подключение 1 биржи</li>
                <li className="mb-2">✔ Базовый доступ к Академии</li>
              </ul>
              <div className="mt-auto">
                <button className="btn btn-outline-light w-100">Попробовать</button>
              </div>
            </div>
          </div>

          {/* PLUS */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="stat-card h-100 d-flex flex-column p-4 position-relative">
              <div style={{
                position: 'absolute',
                top: '-15px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#38BDF8',
                color: '#0D1117',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
              }}>
                ПОПУЛЯРНЫЙ
              </div>
              <h4 className="fw-bold pt-3">Плюс</h4>
              <h2 style={{ color: '#38BDF8' }}>$14.99</h2>
              <p className="mb-4" style={{ color: '#9CA3AF' }}>в месяц</p>
              {/* ИЗМЕНЕНО: Обновлен список возможностей */}
              <ul className="list-unstyled mb-4" style={{ color: '#E5E7EB', flexGrow: 1 }}>
                <li className="mb-2">✔ Сумма до $5000</li>
                <li className="mb-2">✔ До 3 портфелей</li>
                <li className="mb-2">✔ До 3 бирж</li>
                <li className="mb-2">✔ Полный доступ к Академии</li>
                <li className="mb-2">✔ Персональная поддержка</li>
              </ul>
              <div className="mt-auto">
                <button className="btn btn-primary w-100">Подключить</button>
              </div>
            </div>
          </div>

          {/* PRO */}
          <div className="col-md-6 col-lg-4 mb-4">
            <div className="stat-card h-100 d-flex flex-column p-4" style={{
              borderColor: '#38BDF8',
              boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)'
            }}>
              <h4 className="fw-bold">Про</h4>
              <h2 style={{ color: '#38BDF8' }}>$29.99</h2>
              <p className="mb-4" style={{ color: '#9CA3AF' }}>в месяц</p>
              {/* ИЗМЕНЕНО: Обновлен список возможностей */}
              <ul className="list-unstyled mb-4" style={{ color: '#E5E7EB', flexGrow: 1 }}>
                <li className="mb-2">✔ Безлимитная сумма</li>
                <li className="mb-2">✔ Неограничено портфелей</li>
                <li className="mb-2">✔ Неограничено бирж</li>
                <li className="mb-2">✔ Полный доступ к Академии</li>
                <li className="mb-2">✔ Персональная поддержка</li>
              </ul>
              <div className="mt-auto">
                <button className="btn btn-primary w-100">Подключить</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mainfooter py-4 px-4 border-top" style={{ background: '#0D1117', borderColor: '#30363D' }}>
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
    </div>
  );
}
