import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; 

// Данные для образовательного раздела
const educationData = {
  beginner: [
    {
      id: 1,
      title: 'Что такое криптовалюта и блокчейн?',
      description: 'Фундаментальные понятия, с которых начинается путь в мир цифровых активов.',
      premium: false,
    },
    {
      id: 2,
      title: 'Как работает биржа и кошелек?',
      description: 'Практическое руководство по созданию кошелька и первым шагам на криптобирже.',
      premium: false,
    },
    {
      id: 3,
      title: 'Основные термины инвестора',
      description: 'Разбираем, что такое Bull/Bear Market, Altcoin, Gas, KYC и другие важные слова.',
      premium: false,
    },
  ],
  intermediate: [
    {
      id: 4,
      title: 'Основы технического анализа',
      description: 'Учимся читать графики, понимать тренды и использовать ключевые индикаторы.',
      premium: false,
    },
    {
      id: 5,
      title: 'Фундаментальный анализ проектов',
      description: 'Как оценивать криптовалютные проекты, их команду и технологию перед инвестированием.',
      premium: false,
    },
    {
      id: 6,
      title: 'Мир DeFi, NFT и стейкинга',
      description: 'Погружаемся в мир децентрализованных финансов, невзаимозаменяемых токенов и пассивного дохода.',
      premium: false,
    },
  ],
  advanced: [
    {
      id: 7,
      title: 'Как самому собирать портфель',
      description: 'Стратегии диверсификации, выбор активов и управление рисками для создания сбалансированного портфеля.',
      premium: true,
    },
    {
      id: 8,
      title: 'Готовые роадмапы по крипте',
      description: 'Примеры и шаблоны инвестиционных путей для разных целей и уровней риска.',
      premium: true,
    },
    {
      id: 9,
      title: 'Психология трейдинга и управление эмоциями',
      description: 'Как сохранять холодную голову и избегать распространенных ошибок, вызванных страхом и жадностью.',
      premium: true,
    },
  ]
};

// Иконка замка
const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
    </svg>
);


// ИЗМЕНЕНО: Компонент карточки теперь полностью соответствует стилю stat-card
const EducationCard = ({ title, description, premium }) => (
  <div className={`stat-card h-100 d-flex flex-column p-4 ${premium ? 'position-relative' : ''}`}>
    {premium && (
        <div style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: '#38BDF8',
            color: '#0D1117',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
        }}>
          <LockIcon />
          
        </div>
      )}
    <h5 className="fw-bold mb-3">{title}</h5>
    <p style={{color: '#9CA3AF', flexGrow: 1}}>{description}</p>
    {premium ? (
        <Link to="/pricing" className="btn btn-primary btn-sm mt-auto">
            Повысить тариф
        </Link>
    ) : (
        <a href="#!" className="education-card-link mt-auto">Изучить →</a>
    )}
  </div>
);

// Основной компонент раздела "Академия"
export default function AcademyView() {
  return (
    <div className="container-xl py-3">
      <div className="text-center mb-3">
        <h2 className="fw-bold">🎓 Академия Mind Profit</h2>
        <p className="lead" style={{color: '#9CA3AF'}}>Ваш путь от новичка до эксперта в мире криптовалют.</p>
      </div>

      {/* Уровень: Новичок */}
      <div className="mb-5">
        <h3 className="level-title">Уровень: Новичок</h3>
        <div className="row g-4">
          {educationData.beginner.map(item => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <EducationCard title={item.title} description={item.description} premium={item.premium} />
            </div>
          ))}
        </div>
      </div>

      {/* Уровень: Средний */}
      <div className="mb-5">
        <h3 className="level-title">Уровень: Средний</h3>
        <div className="row g-4">
          {educationData.intermediate.map(item => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <EducationCard title={item.title} description={item.description} premium={item.premium} />
            </div>
          ))}
        </div>
      </div>

      {/* Уровень: Высокий */}
      <div className="mb-5">
        <h3 className="level-title">Уровень: Высокий</h3>
        <div className="row g-4">
          {educationData.advanced.map(item => (
            <div key={item.id} className="col-lg-4 col-md-6">
              <EducationCard title={item.title} description={item.description} premium={item.premium} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
