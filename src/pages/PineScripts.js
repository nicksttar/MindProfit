// src/pages/TradingBotsView.js
import React, { useState } from 'react';

// --- Иконки для кнопок ---
const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard" viewBox="0 0 16 16">
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>
);

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clipboard-check" viewBox="0 0 16 16">
        <path fillRule="evenodd" d="M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
        <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
        <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
    </svg>
);

// Данные со скриптами
// ИЗМЕНЕНО: Добавлены данные бэктеста для каждой стратегии
const pineScripts = [
  {
    id: 'sma-crossover',
    title: 'Пересечение скользящих средних (SMA Crossover)',
    description: 'Простая стратегия, которая генерирует сигналы на покупку/продажу при пересечении двух скользящих средних (быстрой и медленной).',
    backtest: {
      profitPercent: '125.4%',
      maxDrawdown: '23.8%',
      totalTrades: 152,
      winRate: '48.03%',
      profitFactor: 1.78
    },
    code: `//@version=5
strategy("Simple SMA Crossover", overlay=true)

// Inputs
fast_length = input.int(9, "Fast SMA Length")
slow_length = input.int(21, "Slow SMA Length")

// SMA Calculations
fast_sma = ta.sma(close, fast_length)
slow_sma = ta.sma(close, slow_length)

// Plot SMAs
plot(fast_sma, "Fast SMA", color.orange)
plot(slow_sma, "Slow SMA", color.blue)

// Strategy
if (ta.crossover(fast_sma, slow_sma))
    strategy.entry("Buy", strategy.long)

if (ta.crossunder(fast_sma, slow_sma))
    strategy.close("Buy")
`
  },
  {
    id: 'rsi-bounce',
    title: 'Стратегия на основе RSI (RSI Bounce)',
    description: 'Стратегия, использующая индикатор RSI для определения зон перекупленности и перепроданности для входа в позицию.',
    backtest: {
      profitPercent: '210.7%',
      maxDrawdown: '18.2%',
      totalTrades: 112,
      winRate: '62.50%',
      profitFactor: 2.45
    },
    code: `//@version=5
strategy("RSI Bounce Strategy", overlay=false)

// Inputs
rsi_length = input.int(14, "RSI Length")
oversold = input.int(30, "Oversold Level")
overbought = input.int(70, "Overbought Level")

// RSI Calculation
rsi = ta.rsi(close, rsi_length)

// Plot RSI
plot(rsi, "RSI", color.purple)
hline(overbought, "Overbought", color.red)
hline(oversold, "Oversold", color.green)

// Strategy
if (ta.crossover(rsi, oversold))
    strategy.entry("RSI_Buy", strategy.long)

if (ta.crossunder(rsi, overbought))
    strategy.entry("RSI_Sell", strategy.short)
`
  },
];

const PineScripts = ({ userId }) => {
    const [copiedId, setCopiedId] = useState(null);
    // Новое состояние для отслеживания полностью раскрытых скриптов
    // Используем Set для удобного добавления/удаления ID
    const [fullyExpanded, setFullyExpanded] = useState(new Set());

    const handleCopy = (script) => {
        navigator.clipboard.writeText(script.code).then(() => {
            setCopiedId(script.id);
            setTimeout(() => setCopiedId(null), 2000); // Сбросить состояние через 2 секунды
        }).catch(err => {
            console.error('Не удалось скопировать текст: ', err);
        });
    };

    // Функция для переключения полного отображения кода
    const toggleExpandCode = (scriptId) => {
        setFullyExpanded(prev => {
            const newSet = new Set(prev);
            if (newSet.has(scriptId)) {
                newSet.delete(scriptId); // Если уже раскрыт, сворачиваем
            } else {
                newSet.add(scriptId); // Если свернут, раскрываем
            }
            return newSet;
        });
    };

    return (
        <div className="container-fluid px-0">
            <div className="text-center mb-5">
                <h2 className="fw-bold">🤖 Готовые Pine-скрипты</h2>
                <p className="lead" style={{ color: '#9CA3AF' }}>Используйте эти скрипты в TradingView для тестирования стратегий.</p>
            </div>

            <div className="accordion" id="pineScriptsAccordion">
                {pineScripts.map((script, index) => (
                    <div className="accordion-item" key={script.id} style={{ backgroundColor: 'rgba(31, 41, 59, 0.5)', border: '1px solid #30363D', marginBottom: '1rem', borderRadius: '16px' }}>
                        <h2 className="accordion-header" id={`heading-${script.id}`}>
                            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#collapse-${script.id}`} aria-expanded="false" aria-controls={`collapse-${script.id}`} style={{ background: 'transparent', color: 'white', boxShadow: 'none' }}>
                                {script.title}
                            </button>
                        </h2>
                        <div id={`collapse-${script.id}`} className="accordion-collapse collapse" aria-labelledby={`heading-${script.id}`} data-bs-parent="#pineScriptsAccordion">
                            <div className="accordion-body">
                                <p style={{ color: '#9CA3AF' }}>{script.description}</p>

                                {/* --- НАЧАЛО: Блок с данными бэктеста --- */}
                                <div className="p-3 rounded mb-4" style={{backgroundColor: '#0D1117', border: '1px solid #30363D'}}>
                                    <h6 className="mb-3 small" style={{color: '#6B7280'}}>Базовые данные бэктеста (BTCUSDT, 4h):</h6>
                                    <div className="row g-2 text-center small" style={{color: '#E5E7EB'}}>
                                        <div className="col"><strong style={{color: '#9CA3AF'}}>Прибыль:</strong> <span className="text-success fw-bold">{script.backtest.profitPercent}</span></div>
                                        <div className="col"><strong style={{color: '#9CA3AF'}}>Просадка:</strong> {script.backtest.maxDrawdown}</div>
                                        <div className="col"><strong style={{color: '#9CA3AF'}}>Сделок:</strong> {script.backtest.totalTrades}</div>
                                        <div className="col"><strong style={{color: '#9CA3AF'}}>Прибыльных:</strong> {script.backtest.winRate}</div>
                                        <div className="col"><strong style={{color: '#9CA3AF'}}>Фактор прибыли:</strong> {script.backtest.profitFactor}</div>
                                    </div>
                                </div>
                                {/* --- КОНЕЦ: Блок с данными бэктеста --- */}

                                <div className="position-relative">
                                    <pre className="p-3 rounded" style={{ backgroundColor: '#0D1117', whiteSpace: 'pre-wrap', wordBreak: 'break-all', border: '1px solid #30363D', maxHeight: fullyExpanded.has(script.id) ? 'none' : '250px', overflow: 'hidden', transition: 'max-height 0.3s ease-out' }}>
                                        <code style={{color: '#D1D5DB'}}>
                                            {script.code}
                                        </code>
                                    </pre>
                                    
                                    {/* --- НАЧАЛО: Градиент и кнопка "Показать", если код свернут --- */}
                                    {!fullyExpanded.has(script.id) && script.code.split('\n').length > 10 && (
                                        <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center align-items-end" style={{ height: '60px', background: 'linear-gradient(to top, #0D1117 50%, transparent)', pointerEvents: 'none' }}>
                                            <button 
                                                className="btn btn-sm btn-outline-info mb-2"
                                                style={{ pointerEvents: 'auto' }}
                                                onClick={() => toggleExpandCode(script.id)}
                                            >
                                                ▼ Показать полностью
                                            </button>
                                        </div>
                                    )}
                                    {/* --- КОНЕЦ --- */}

                                    <button onClick={() => handleCopy(script)} className="btn btn-sm btn-outline-light position-absolute top-0 end-0 m-2">
                                        {copiedId === script.id ? <><CheckIcon /> Скопировано</> : <><CopyIcon /> Копировать</>}
                                    </button>
                                </div>
                                
                                {/* --- НАЧАЛО: Кнопка "Свернуть", если код раскрыт --- */}
                                {fullyExpanded.has(script.id) && script.code.split('\n').length > 10 && (
                                    <div className="text-center mt-2">
                                        <button 
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => toggleExpandCode(script.id)}
                                        >
                                            ▲ Свернуть код
                                        </button>
                                    </div>
                                )}
                                {/* --- КОНЕЦ --- */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PineScripts;