import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- НОВЫЙ КОМПОНЕНТ: Виджет общей капитализации ---
const MarketCapWidget = ({ data, loading, error }) => {
    if (loading) return <div className="stat-card p-4 text-center">Загрузка данных...</div>;
    if (error) return <div className="stat-card p-4 text-center text-danger">{error}</div>;
    if (!data) return <div className="stat-card p-4 text-center">Нет данных.</div>;

    const marketCap = data.total_market_cap?.usd || 0;
    const marketCapChange = data.market_cap_change_percentage_24h_usd || 0;
    const isPositive = marketCapChange >= 0;
    
    return (
        <div className="stat-card p-4 h-100 d-flex flex-column">
            <h5 className="fw-bold">Капитализация рынка</h5>
            <p className="small" style={{ color: '#9CA3AF' }}>Общая стоимость всех криптовалют.</p>
            <div className="text-center my-auto">
                <h1 className="display-4 fw-bold">
                    ${(marketCap / 1e12).toFixed(2)}T
                </h1>
                <p className={`fw-bold ${isPositive ? 'text-success' : 'text-danger'}`} style={{ fontSize: '1.2rem' }}>
                    {isPositive ? '+' : ''}{marketCapChange.toFixed(2)}% (24ч)
                </p>
            </div>
        </div>
    );
};

const MarketMovers = ({ data, loading, error }) => {
    if (loading) return <div className="stat-card p-4 text-center">Загрузка лидеров...</div>;
    if (error) return <div className="stat-card p-4 text-center text-danger">{error}</div>;
    if (!data?.gainers || !data?.losers) return <div className="stat-card p-4 text-center">Нет данных.</div>;

    return (
        <div className="stat-card p-4 h-100">
            <h5 className="fw-bold mb-3">Лидеры рынка (24ч)</h5>
            <div className="row">
                <div className="col-6">
                    <h6 className="small text-success">🚀 Лидеры роста</h6>
                    <ul className="list-unstyled mb-0">
                        {data.gainers.map(coin => (
                            <li key={coin.id} className="d-flex justify-content-between small mb-1">
                                <span>{coin.symbol.toUpperCase()}</span>
                                <span className="text-success">+{coin.price_change_percentage_24h.toFixed(2)}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-6">
                    <h6 className="small text-danger">📉 Лидеры падения</h6>
                    <ul className="list-unstyled mb-0">
                        {data.losers.map(coin => (
                            <li key={coin.id} className="d-flex justify-content-between small mb-1">
                                <span>{coin.symbol.toUpperCase()}</span>
                                <span className="text-danger">{coin.price_change_percentage_24h.toFixed(2)}%</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ActiveCurrenciesWidget = ({ data, loading, error }) => {
    if (loading) return <div className="stat-card p-4 text-center">Загрузка...</div>;
    if (error) return <div className="stat-card p-4 text-center text-danger">{error}</div>;
    if (!data) return <div className="stat-card p-4 text-center">Нет данных.</div>;

    const activeCryptos = data.active_cryptocurrencies || 0;
    const markets = data.markets || 0;

    return (
        <div className="stat-card p-4 h-100">
            <h5 className="fw-bold mb-3">Обзор рынка</h5>
            <div className="d-flex justify-content-around text-center">
                <div>
                    <p className="small mb-1" style={{ color: '#9CA3AF' }}>Активные монеты</p>
                    <h4 className="fw-bold">{activeCryptos.toLocaleString('en-US')}</h4>
                </div>
                <div><p className="small mb-1" style={{ color: '#9CA3AF' }}>Всего бирж</p><h4 className="fw-bold">{markets}</h4></div>
            </div>
        </div>
    );
};

const BtcDominance = ({ data, loading, error }) => {
    if (loading) return <div className="stat-card p-4 text-center">Загрузка...</div>;
    if (error) return <div className="stat-card p-4 text-center text-danger">{error}</div>;
    if (!data) return <div className="stat-card p-4 text-center">Нет данных.</div>;

    const dominance = data.market_cap_percentage?.btc || 0;

    return (
        <div className="stat-card p-4 h-100 d-flex flex-column">
            <h5 className="fw-bold">Доминация BTC</h5>
            <p className="small" style={{ color: '#9CA3AF' }}>Доля BTC в общей капитализации.</p>
            <div className="text-center my-auto">
                <h1 className="display-4 fw-bold">{dominance.toFixed(1)}%</h1>
            </div>
            <div style={{ width: '100%', backgroundColor: '#30363D', borderRadius: '5px', height: '10px' }}>
                <div style={{
                    width: `${dominance}%`,
                    height: '100%',
                    backgroundColor: '#F7931A', // Bitcoin orange
                    borderRadius: '5px',
                    transition: 'width 0.5s ease-in-out'
                }}></div>
            </div>
        </div>
    );
};

const EthGasWidget = ({ data, loading, error }) => {
    if (loading) return <div className="stat-card p-4 text-center">Загрузка...</div>;
    if (error) return <div className="stat-card p-4 text-center text-danger">{error}</div>;
    if (!data) return <div className="stat-card p-4 text-center">Нет данных.</div>;

    const ethPrice = data.ethPrice?.usd || 0;
    const gasPrice = data.gasPrice || 0;

    return (
        <div className="stat-card p-4 h-100">
            <h5 className="fw-bold mb-3">Ethereum</h5>
            <div className="d-flex justify-content-around text-center">
                <div><p className="small mb-1" style={{ color: '#9CA3AF' }}>Цена ETH</p><h4 className="fw-bold">${ethPrice.toLocaleString('en-US')}</h4></div>
                <div><p className="small mb-1" style={{ color: '#9CA3AF' }}>Gas (Fast)</p><h4 className="fw-bold">{gasPrice} Gwei</h4></div>
            </div>
        </div>
    );
};


function Analytic() {
    // ИЗМЕНЕНО: Объединяем состояния для одного запроса
    const [globalData, setGlobalData] = useState({ data: null, loading: true, error: null });
    const [marketMovers, setMarketMovers] = useState({ data: null, loading: true, error: null });

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setGlobalData({ data: null, loading: true, error: null });
            setMarketMovers({ data: null, loading: true, error: null });

            try {
                // ИЗМЕНЕНО: Один запрос на бэкенд для всех данных
                const response = await axios.get('/api/analytics/all');
                const { global, markets, ethData } = response.data;

                // Собираем данные для виджета ETH + Gas
                const ethWidgetData = {
                    ethPrice: ethData.ethPrice,
                    gasPrice: ethData.gasPrice
                };
                setGlobalData({ data: { ...global, ...ethWidgetData }, loading: false, error: null });
                
                // Данные для лидеров рынка
                const sorted = [...markets].sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0));
                const losers = sorted.slice(0, 5);
                const gainers = sorted.slice(-5).reverse();
                setMarketMovers({ data: { gainers, losers }, loading: false, error: null });
            } catch (error) {
                const errorMessage = 'Не удалось загрузить данные аналитики.';
                setGlobalData({ data: null, loading: false, error: errorMessage });
                setMarketMovers({ data: null, loading: false, error: errorMessage });
            }
        };

        fetchAnalyticsData();
    }, []);

    return (
        <div>
            <div className="text-center mb-5">
            </div>

            <div className="row g-4 mb-4">
                {/* ИЗМЕНЕНО: Виджет капитализации */}
                <div className="col-lg-4 col-md-6">
                    <MarketCapWidget {...globalData} />
                </div>

                {/* Виджет: Доминация BTC */}
                <div className="col-lg-4 col-md-6">
                    <BtcDominance {...globalData} />
                </div>

                {/* Виджет: Лидеры роста и падения */}
                <div className="col-lg-4 col-md-12">
                    <MarketMovers {...marketMovers} />
                </div>
            </div>
            <div className="row g-4">
                {/* НОВЫЙ ВИДЖЕТ: Цена ETH и газ */}
                <div className="col-lg-4 col-md-6">
                    <EthGasWidget {...globalData} />
                </div>
                {/* НОВЫЙ ВИДЖЕТ: Объем торгов */}
                <div className="col-lg-4 col-md-6">
                    {/* Можно создать отдельный компонент, но для простоты пока так */}
                    <MarketCapWidget data={{ total_market_cap: globalData.data?.total_volume, market_cap_change_percentage_24h_usd: 0 }} loading={globalData.loading} error={globalData.error} />
                </div>
                {/* НОВЫЙ ВИДЖЕТ: Активные криптовалюты */}
                <div className="col-lg-4 col-md-6">
                    <ActiveCurrenciesWidget {...globalData} />
                </div>
            </div>
        </div>
    );
}

export default Analytic;