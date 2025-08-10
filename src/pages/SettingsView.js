// src/components/SettingsView.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

const Icon = ({ name }) => <i className={`bi bi-${name}`} style={{ marginRight: '10px' }}></i>;

// Компонент теперь принимает userId от родителя (Dashboard.js)
export default function SettingsView({ userId }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPlan, setCurrentPlan] = useState({ name: 'Бесплатный', price: 0 });
  
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [connectedExchanges, setConnectedExchanges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const allExchanges = [
    { id: 'binance', name: 'Binance', logo: '/img/binance.png' },
    { id: 'okx', name: 'OKX', logo: '/img/okx.png' },
    { id: 'bybit', name: 'Bybit', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f4/Bybit_logo.svg' },
  ];

  // Функция для загрузки данных вынесена отдельно
  const fetchUserData = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`/api/auth/user/${userId}`);
      if (response.data) {
        setUserData({ name: response.data.name || 'Имя не указано', email: response.data.email });
        setConnectedExchanges(response.data.exchanges || []);
      }
    } catch (error) {
      console.error("Не удалось загрузить данные пользователя:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Эффект для первоначальной загрузки и подписки на событие focus
  useEffect(() => {
    fetchUserData();
    window.addEventListener('focus', fetchUserData);
    return () => {
      window.removeEventListener('focus', fetchUserData);
    };
  }, [userId]);

  const handleRevoke = async (exchangeName) => {
    if (!window.confirm(`Вы уверены, что хотите отозвать ключи для ${exchangeName}?`)) {
        return;
    }
    try {
        await axios.post('/api/binance/revoke', { userId, exchangeName });
        setConnectedExchanges(prev => prev.filter(ex => ex.exchangeName !== exchangeName));
        alert('Ключи успешно отозваны!');
    } catch (error) {
        console.error("Ошибка при отзыве ключей:", error);
        alert('Не удалось отозвать ключи.');
    }
  };

  return (
    <div>
      <div className="text-center mb-5">
        <h2 className="fw-bold">⚙️ Настройки</h2>
        <p className="lead" style={{color: '#9CA3AF'}}>Управляйте вашим аккаунтом, безопасностью и подключениями.</p>
      </div>

      <div className="settings-layout">
        <div className="settings-sidebar">
          <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            <Icon name="person-circle" /> Профиль
          </button>
          <button className={activeTab === 'billing' ? 'active' : ''} onClick={() => setActiveTab('billing')}>
            <Icon name="credit-card" /> Тарифный план
          </button>
          <button className={activeTab === 'security' ? 'active' : ''} onClick={() => setActiveTab('security')}>
            <Icon name="shield-lock-fill" /> Безопасность
          </button>
          <button className={activeTab === 'exchanges' ? 'active' : ''} onClick={() => setActiveTab('exchanges')}>
            <Icon name="plugin-fill" /> Подключенные биржи
          </button>
          <button className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
            <Icon name="bell-fill" /> Уведомления
          </button>
          <hr className="my-3" style={{borderColor: 'rgba(255,255,255,0.2)'}}/>
          <button className="logout-btn-header" style={{width: '100%'}}>
            <Icon name="box-arrow-right" /> Выход
          </button>
        </div>

        <div className="settings-content">
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h4>Профиль пользователя</h4>
              <div className="mb-3">
                <label htmlFor="userName" className="form-label">Имя пользователя</label>
                <input type="text" id="userName" className="form-control" defaultValue={userData.name} />
              </div>
              <div className="mb-3">
                <label htmlFor="userEmail" className="form-label">Email</label>
                <input type="email" id="userEmail" className="form-control" value={userData.email} disabled />
                <div className="form-text">Email используется для входа и не может быть изменен.</div>
              </div>
              <button className="btn btn-primary">Сохранить изменения</button>
            </div>
          )}

          {activeTab === 'billing' && (
            <>
              <div className="settings-section">
                <h4>Ваш текущий план</h4>
                <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{backgroundColor: '#161B22', border: '1px solid #30363D'}}>
                    <div>
                        <h5 className="mb-1 fw-bold" style={{color: '#38BDF8'}}>{currentPlan.name}</h5>
                        <p className="mb-0" style={{color: '#9CA3AF'}}>Это ваш текущий тарифный план.</p>
                    </div>
                    <Link to="/pricing" className="btn btn-outline-light">Сменить тариф</Link>
                </div>
              </div>
              <div className="settings-section">
                <h4>Доступные для перехода</h4>
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="stat-card h-100 d-flex flex-column">
                            <h5 className="fw-bold">Плюс</h5>
                            <h3 style={{ color: '#38BDF8' }}>$14.99 <span style={{fontSize: '1rem', color: '#9CA3AF'}}>/ мес.</span></h3>
                            <ul className="list-unstyled my-4" style={{ color: '#E5E7EB', flexGrow: 1 }}>
                                <li className="mb-2">✔ До 25 монет</li>
                                <li className="mb-2">✔ До $5000</li>
                                <li className="mb-2">✔ Персональная поддержка</li>
                            </ul>
                            <Link to="/pricing" className="btn btn-primary w-100">Перейти на Плюс</Link>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="stat-card h-100 d-flex flex-column">
                            <h5 className="fw-bold">Про</h5>
                            <h3 style={{ color: '#38BDF8' }}>$29.99 <span style={{fontSize: '1rem', color: '#9CA3AF'}}>/ мес.</span></h3>
                             <ul className="list-unstyled my-4" style={{ color: '#E5E7EB', flexGrow: 1 }}>
                                <li className="mb-2">✔ Безлимитная сумма</li>
                                <li className="mb-2">✔ Неограничено монет</li>
                                <li className="mb-2">✔ Персональная поддержка</li>
                            </ul>
                            <Link to="/pricing" className="btn btn-primary w-100">Перейти на Про</Link>
                        </div>
                    </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'security' && (
            <>
              <div className="settings-section">
                <h4>Смена пароля</h4>
                <div className="mb-3">
                  <label className="form-label">Текущий пароль</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Новый пароль</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Подтвердите новый пароль</label>
                  <input type="password" className="form-control" />
                </div>
                <button className="btn btn-primary">Сменить пароль</button>
              </div>
              <div className="settings-section">
                  <h4>Двухфакторная аутентификация (2FA)</h4>
                  <p style={{color: '#9CA3AF'}}>Защитите свой аккаунт с помощью дополнительного уровня безопасности.</p>
                  <button className="btn btn-outline-light">Настроить 2FA</button>
              </div>
            </>
          )}

          {activeTab === 'exchanges' && (
             <div className="settings-section">
                <h4>Подключенные биржи</h4>
                <p style={{color: '#9CA3AF'}}>Добавьте или удалите API ключи ваших бирж.</p>
                {isLoading ? <div className="text-center p-5"><div className="spinner-border text-primary" role="status"></div></div> : (
                    <ul className="list-group list-group-flush">
                      {allExchanges.map(ex => {
                        // ИСПРАВЛЕНО: Добавлена "защита" от пробелов и разного регистра
                        const isConnected = connectedExchanges.some(ce => 
                            ce.exchangeName.trim().toLowerCase() === ex.id.trim().toLowerCase()
                        );
                        
                        return (
                            <li key={ex.id} className="list-group-item d-flex align-items-center" style={{backgroundColor: 'transparent', borderBottom: '1px solid #30363D', paddingLeft: 0, paddingRight: 0}}>
                                <img src={ex.logo} alt={`${ex.name} logo`} style={{width: '24px', marginRight: '15px'}} />
                                <span className="fw-bold flex-grow-1">{ex.name}</span>
                                {isConnected ? (
                                  <>
                                    <span className="badge bg-success me-3">Подключено</span>
                                    <button onClick={() => handleRevoke(ex.id)} className="btn btn-sm btn-outline-danger">Отозвать</button>
                                  </>
                                ) : (
                                  <>
                                    <span className="badge bg-secondary me-3">Не подключено</span>
                                    <button className="btn btn-sm btn-primary">Подключить</button>
                                  </>
                                )}
                            </li>
                        );
                      })}
                    </ul>
                )}
             </div>
          )}

          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h4>Настройки уведомлений</h4>
                <div className="form-check form-switch fs-5">
                  <input className="form-check-input" type="checkbox" role="switch" id="emailNotifications" defaultChecked/>
                  <label className="form-check-label" htmlFor="emailNotifications">Email-уведомления о новостях</label>
                </div>
                <div className="form-check form-switch fs-5 mt-3">
                  <input className="form-check-input" type="checkbox" role="switch" id="portfolioNotifications" defaultChecked/>
                  <label className="form-check-label" htmlFor="portfolioNotifications">Уведомления о резких изменениях портфеля</label>
                </div>
            </div>
          )}

           <div className="settings-section mt-4 p-3" style={{borderColor: 'rgba(239, 68, 68, 0.5)'}}>
             <div className="d-flex justify-content-between align-items-center">
               <div>
                 <p className="mb-1 fw-bold">Удаление аккаунта</p>
                 <p className="mb-0 small" style={{color: '#9CA3AF'}}>Это действие нельзя будет отменить.</p>
               </div>
               <button className="btn btn-danger btn-sm">Удалить</button>
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
