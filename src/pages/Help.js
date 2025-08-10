import { useState } from "react";
import { Link } from "react-router-dom"; 

const faqData = [
  {
    question: "Сколько это стоит?",
    answer: "Mind Profit берёт комиссию 5% от прибыли. Без прибыли — без комиссии.",
  },
  {
    question: "Можно ли вывести прибыль в любой момент?",
    answer: "Да, вы можете вывести средства в любой момент — это ваш аккаунт и ваша биржа.",
  },
  {
    question: "Насколько это безопасно?",
    answer: "Мы не храним ваши средства. Все операции происходят через API вашей биржи.",
  },
  {
    question: "Какие биржи поддерживаются?",
    answer: "Мы поддерживаем Binance, OKX и Bybit. В будущем список будет расширен.",
  },
  // ИЗМЕНЕНО: Добавлен новый вопрос о поддержке
  {
    question: "Как с вами связаться?",
    answer: "Если вы не нашли ответ на свой вопрос, вы можете связаться с нашей службой поддержки. Мы всегда рады помочь! Telegram: @nickdevit, Email: mind.profit@gmail.com",
  },
];

export default function Help() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="d-flex flex-column" style={{ height: '100%' }}>
      <div className="container-xl flex-grow-1 py-5" style={{ paddingTop: '100px' }}>
        <h2 className="text-center fw-bold mb-3">Помощь и FAQ</h2>
        <p className="text-center mb-5" style={{ color: '#9CA3AF' }}>
          Ответы на популярные вопросы о платформе Mind Profit
        </p>

        <div className="mx-auto" style={{ maxWidth: '800px' }}>
          <div className="accordion">
            {faqData.map((item, index) => (
              <div
                key={index}
                className="stat-card mb-3 p-3"
              >
                <div className="w-100">
                  <button
                    className="w-100 d-flex justify-content-between align-items-center p-0 border-0 bg-transparent text-start text-white fw-semibold"
                    onClick={() => toggle(index)}
                    style={{ fontSize: '1.1rem' }}
                  >
                    {item.question}
                    <span style={{ fontSize: "1.5rem", color: "#38BDF8", transform: openIndex === index ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease' }}>
                      +
                    </span>
                  </button>

                  <div
                    style={{
                      maxHeight: openIndex === index ? "200px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.4s ease-in-out, opacity 0.4s ease-in-out",
                      opacity: openIndex === index ? 1 : 0,
                    }}
                  >
                    <div className="pt-3" style={{ color: '#9CA3AF' }}>
                      {item.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
            <Link to="/cookies" className="text-decoration-none small" style={{ color: '#9CA3AF' }}>Политика cookie</Link>
            <Link to="/disclaimer" className="text-decoration-none small" style={{ color: '#9CA3AF' }}>Дисклеймер</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
