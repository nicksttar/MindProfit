import { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Иконки для визуального акцента
const RocketIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" style={{ color: '#38BDF8' }}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.3.05-3.11.65-.81 2.26-1.05 3.1-2.95.84-1.9.53-4.14-1.2-5.87-1.74-1.74-3.97-2.04-5.87-1.2.84.66.94 2.05.32 2.91-.86.85-2.25.75-2.91.32-1.9.84-2.14 2.45-2.95 3.1.81.65 3.1.7 3.11.05z"></path>
    <path d="m12 15-3-3a9 9 0 0 1 3 3v0z"></path>
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" style={{ color: '#38BDF8' }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
  </svg>
);

const GraduationCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" style={{ color: '#38BDF8' }}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c3.33 1.67 6.67 1.67 10 0v-5"></path>
  </svg>
);

// ИЗМЕНЕНО: Новые иконки для портфелей
const LayersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" style={{ color: '#38BDF8' }}>
        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
        <polyline points="2 17 12 22 22 17"></polyline>
        <polyline points="2 12 12 17 22 12"></polyline>
    </svg>
);

const SlidersIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-3" style={{ color: '#38BDF8' }}>
        <line x1="4" y1="21" x2="4" y2="14"></line>
        <line x1="4" y1="10" x2="4" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12" y2="3"></line>
        <line x1="20" y1="21" x2="20" y2="16"></line>
        <line x1="20" y1="12" x2="20" y2="3"></line>
        <line x1="1" y1="14" x2="7" y2="14"></line>
        <line x1="9" y1="8" x2="15" y2="8"></line>
        <line x1="17" y1="16" x2="23" y2="16"></line>
    </svg>
);


export default function Invest() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className="d-flex flex-column flex-grow-1">
      <div className="container-xl flex-grow-1 py-5" style={{ paddingTop: '100px' }}>

        {/* Секция 1: Главное предложение */}
        <section className="text-center py-5">
          <div data-aos="fade-up">
            <h1 className="display-4 fw-bold mb-3">Инвестируйте как профессионал, без усилий</h1>
            <p className="lead mx-auto mb-4" style={{ color: '#9CA3AF', maxWidth: '700px' }}>
              Mind Profit анализирует рынок и автоматически формирует для вас сбалансированный портфель из топ-25 криптовалют. Вам больше не нужно тратить время на анализ и ручную торговлю.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg px-5">Начать</Link>
          </div>
        </section>

        {/* Секция 2: Ключевые преимущества */}
        <section className="py-5">
          <div className="row g-4 text-center">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="stat-card h-100 p-4">
                <RocketIcon />
                <h5 className="fw-bold mb-2">Автоматический Индекс</h5>
                <p style={{ color: '#9CA3AF' }}>Система самостоятельно ребалансирует ваш портфель, чтобы он всегда соответствовал актуальным трендам рынка.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="stat-card h-100 p-4">
                <ShieldIcon />
                <h5 className="fw-bold mb-2">Безопасность и Контроль</h5>
                <p style={{ color: '#9CA3AF' }}>Ваши средства остаются на вашем личном счете на бирже. Мы управляем торговлей через безопасные API ключи.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-card h-100 p-4">
                <GraduationCapIcon />
                <h5 className="fw-bold mb-2">Обучение для Новичков</h5>
                <p style={{ color: '#9CA3AF' }}>Получите доступ к нашей "Академии" после регистрации и узнайте все основы успешного инвестирования.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ИЗМЕНЕНО: Новая секция про гибкость портфелей */}
        <section className="py-5 my-4">
            <div className="text-center mb-5" data-aos="fade-up">
                <h2 className="fw-bold display-5">Гибкость для каждого инвестора</h2>
                <p className="lead mx-auto" style={{ color: '#9CA3AF', maxWidth: '700px' }}>
                Независимо от вашего опыта, у нас есть подходящее решение. Выберите готовую стратегию или создайте свою собственную.
                </p>
            </div>
            <div className="row g-4">
                <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                    <div className="stat-card h-100 p-4 d-flex flex-column text-center">
                        <LayersIcon />
                        <h5 className="fw-bold mb-2">Готовые стратегии</h5>
                        <p style={{ color: '#9CA3AF', flexGrow: 1 }}>
                        Начните быстро с одним из наших сбалансированных портфелей. Мы предлагаем варианты для консервативных, умеренных и агрессивных инвесторов.
                        </p>
                        <div className="mt-3">
                            <Link to="/pricing" className="btn btn-outline-light">Посмотреть планы</Link>
                        </div>
                    </div>
                </div>
                <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                    <div className="stat-card h-100 p-4 d-flex flex-column text-center">
                        <SlidersIcon />
                        <h5 className="fw-bold mb-2">Конструктор портфелей</h5>
                        <p style={{ color: '#9CA3AF', flexGrow: 1 }}>
                        Для опытных пользователей. Создайте уникальную инвестиционную стратегию, выбирая монеты и настраивая их веса в портфеле самостоятельно.
                        </p>
                        <div className="mt-3">
                            <Link to="/register" className="btn btn-primary">Создать свой портфель</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Секция 3: Призыв к действию с акцентом на Академию */}
        <section className="py-5 my-5">
          <div className="stat-card p-5 text-center" data-aos="zoom-in">
            <h2 className="fw-bold mb-3">Начните свой путь в инвестициях правильно</h2>
            <p className="lead mx-auto mb-4" style={{ color: '#9CA3AF', maxWidth: '600px' }}>
              Не уверены, с чего начать? Наша Академия проведет вас по всем шагам. Зарегистрируйтесь, чтобы получить доступ к эксклюзивным материалам и начать формировать свой капитал уже сегодня.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg px-5">Создать аккаунт бесплатно</Link>
          </div>
        </section>

      </div>

      {/* Футер */}
      <footer className=" py-4 px-4 border-top" style={{ background: '#0D1117', borderColor: '#30363D' }}>
        <div className="container-xl d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-3 mb-md-0 small text-center text-md-start">
            © 2025 Mind Profit. All rights reserved.
          </div>
          <div className="d-flex gap-3 flex-wrap justify-content-center">
            <Link to="/privacy" className="text-decoration-none small" style={{ color: '#9CA3AF' }}>Политика конфиденциальности</Link>
            <Link to="/terms" className="text-decoration-none small" style={{ color: '#9CA3AF' }}>Условия использования</Link>
            <Link to="/cookies" className="text-decoration-none small" style={{ color: '#9CA3AF' }}>Политика cookie</Link>
            <Link to="/disclaimer" className="text-decoration-none small" style={{ color: '#9CA3AF' }}>Дисклеймер</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
