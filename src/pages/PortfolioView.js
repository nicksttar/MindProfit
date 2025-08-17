import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

// Импортируем дочерние компоненты
import StatCards from './StatCards';
import ActionCards from './ActionCards';
import GenerationResult from './GenerationResult';
import ActivePortfolios from './ActivePortfolios';

// Импортируем вашу новую функцию из geminiApi.js
import { generateCryptoPortfolio } from '../services/geminiApi';

/**
 * Отображает все содержимое для вкладки "Портфели".
 */
export default function PortfolioView({ userId }) {
    // Все ваши состояния остаются без изменений
    const [portfolios, setPortfolios] = useState([]);
    const [hasBinanceKeys, setHasBinanceKeys] = useState(false);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [dataError, setDataError] = useState(null);
    const [generatedResult, setGeneratedResult] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState(null);
    const [generationType, setGenerationType] = useState(null);

    // Эта функция остается без изменений
    const fetchData = async () => {
        if (!userId) {
            setIsLoadingData(false);
            return;
        }
        setIsLoadingData(true);
        setDataError(null);
        try {
            const [portfoliosRes, balanceRes] = await Promise.all([
                axios.get(`/api/binance/portfolios/${userId}`),
                axios.post('/api/binance/get-balance', { userId })
            ]);
            setPortfolios(portfoliosRes.data.portfolios);
            setHasBinanceKeys(balanceRes.data.success);
        } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            if (err.config?.url.includes('get-balance')) {
                setHasBinanceKeys(false);
            }
            if (err.config?.url.includes('portfolios')) {
                setDataError("Не удалось загрузить активные портфели.");
            }
        } finally {
            setIsLoadingData(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    /**
     * Обновляем функцию handleGenerate
     * Теперь она вызывает generateCryptoPortfolio напрямую.
     */
    const handleGenerate = async (type) => {
        // Мы генерируем только крипто-портфели этой кнопкой
        if (type !== 'crypto') return;

        setIsGenerating(true);
        setGenerationError(null);
        setGeneratedResult(null);
        setGenerationType(type);

        try {
            // Вызываем функцию из вашего сервиса
            const result = await generateCryptoPortfolio();

            // Проверяем, не вернула ли функция ошибку
            if (result.error) {
                throw new Error(result.error);
            }

            // Если все успешно, сохраняем результат
            setGeneratedResult(result);

        } catch (err) {
            console.error("Ошибка при генерации портфеля:", err);
            setGenerationError(err.message || "К сожалению, не удалось сгенерировать идеи. Попробуйте еще раз.");
        } finally {
            setIsGenerating(false);
        }
    };

    /**
     * ✨ ФУНКЦИЯ ДЛЯ РАБОТЫ КРЕСТИКА ✨
     * Эта функция просто очищает результат генерации или сообщение об ошибке.
     */
    const handleCloseResult = () => {
        setGenerationError(null);
        setGeneratedResult(null);
        setGenerationType(null);
    };

    return (
        <div>
            <StatCards portfolioCount={portfolios.length} />

            <div className="mb-5">
                <ActivePortfolios userId={userId} portfolios={portfolios} isLoading={isLoadingData} error={dataError} onUpdate={fetchData} />
            </div>

            <div className="mb-5">
                 {/* ✨ ИЗМЕНЕНИЕ ЗДЕСЬ: Передаем функцию в onClose ✨ */}
                 <GenerationResult
                    isGenerating={isGenerating}
                    error={generationError}
                    result={generatedResult}
                    type={generationType}
                    onClose={handleCloseResult}
                 />
            </div>

            <h4 id="manage-portfolios" className="mb-4">Управление портфелями</h4>
            <ActionCards
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                generationType={generationType}
                userId={userId}
                hasBinanceKeys={hasBinanceKeys}
                onPortfolioCreated={fetchData}
            />
        </div>
    );
}