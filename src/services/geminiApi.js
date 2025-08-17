import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

// Ваша существующая функция для анализа сигналов
export const getAiSignalAnalysis = async (pair, priceData, maData, levels, news, bollingerBandsData) => {
  if (!priceData || !maData || !levels || !bollingerBandsData || priceData.length === 0) {
    return { error: "Недостаточно технических данных для анализа." };
  }

  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      temperature: 0.2, 
    }
  });

  const lastPrice = priceData[priceData.length - 1].close;
  const lastMa = maData[maData.length - 1]?.value.toFixed(2);
  const supportLevels = levels.filter(l => l.type === 'support').map(l => l.price).join(', ');
  const resistanceLevels = levels.filter(l => l.type === 'resistance').map(l => l.price).join(', ');
  
  const newsHeadlines = news && news.length > 0 
    ? news.map(article => `- ${article.title}`).join('\n')
    : "Нет свежих новостей.";

  const lastBB = bollingerBandsData[bollingerBandsData.length - 1];
  const bollingerSummary = `
    - Полосы Боллинджера:
      - Верхняя: ${lastBB.upper.toFixed(2)}
      - Средняя: ${lastBB.middle.toFixed(2)}
      - Нижняя: ${lastBB.lower.toFixed(2)}
  `;

  const prompt = `
    Ты — профессиональный и детальный крипто-аналитик. Твоя задача — объединить технический и фундаментальный анализ для пары ${pair} и предоставить исчерпывающий торговый сигнал в формате JSON.

    1. Технические данные:
    - Текущая цена: ${lastPrice}
    - SMA(50): ${lastMa}
    - Поддержка: ${supportLevels}
    - Сопротивление: ${resistanceLevels}
    ${bollingerSummary}

    2. Фундаментальные данные (последние новости):
    ${newsHeadlines}

    Твоя задача — вернуть только JSON-объект следующей структуры:
    {
      "signal": "LONG, SHORT или FLAT на основе твоего анализа",
      "confidence": "High, Medium или Low на основе твоего анализа",
      "reason": "Твое детальное обоснование на 2-3 предложения, ОБЪЕДИНЯЯ все факторы.",
      "entry_point": "Твоя предложенная цена для входа в сделку.",
      "stop_loss": "Твой предложенный уровень для стоп-лосса.",
      "take_profit": "Твой предложенный уровень для тейк-профита.",
      "technical_summary": [
        { "indicator": "Цена vs SMA(50)", "value": "Твой вывод о положении цены", "sentiment": "Positive, Negative или Neutral" },
        { "indicator": "Уровни", "value": "Твой вывод о взаимодействии с уровнями", "sentiment": "Positive, Negative или Neutral" },
        { "indicator": "Полосы Боллинджера", "value": "Твой вывод о положении цены относительно полос", "sentiment": "Positive, Negative или Neutral" }
      ],
      "news_sentiment": {
        "sentiment": "Positive, Negative или Neutral на основе новостей",
        "summary": "Твое краткое описание, почему новостной фон такой."
      }
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    if (text.includes('```json')) {
      text = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    }
    
    const jsonResponse = JSON.parse(text);
    return jsonResponse;
  } catch (error) {
    console.error("Ошибка при получении или парсинге анализа от Gemini AI:", error);
    return { error: "Не удалось обработать ответ от AI." };
  }
};


/**
 * ✨ ОБНОВЛЕННАЯ ФУНКЦИЯ ✨
 * Генерирует уникальную тему, а затем на ее основе создает крипто-портфель.
 */
export const generateCryptoPortfolio = async () => {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.9,
        }
    });

    try {
        // --- ШАГ 1: Генерируем уникальную тему ---
        const themePrompt = `
            Ты — креативный крипто-инвестор. Придумай одну уникальную и интересную тему для крипто-портфеля.
            Примеры тем: "DeFi гиганты", "Игровые миры (GameFi)", "Конкуренты Ethereum", "Проекты на стыке AI и блокчейна".
            Ответь только названием темы, без лишних слов, кавычек или объяснений.
        `;
        
        const themeResult = await model.generateContent(themePrompt);
        const themeResponse = await themeResult.response;
        const generatedTheme = themeResponse.text().trim(); // Получаем и очищаем тему

        // --- ШАГ 2: Используем сгенерированную тему для создания портфеля ---
        const portfolioPrompt = `
            Ты — опытный крипто-инвестор, который создает тематические портфели.
            Твоя задача — сгенерировать 1 креативный, крипто-портфель на основе следующей темы: "${generatedTheme}".
            
            Придумай броское название для портфеля, которое отражает эту тему.
            Напиши короткое описание идеи портфеля в одно предложение.
            Распредели 100% между 4-5 популярными и релевантными теме криптовалютами. Не используй вымышленные монеты.

            Верни ответ в виде чистого JSON-объекта следующей структуры:
            {
              "name": "Название твоего портфеля",
              "description": "Краткое описание идеи портфеля в одно предложение.",
              "assets": [
                {
                  "coin": "Название криптовалюты",
                  "ticker": "Ее тикер (например, BTC)",
                  "allocation": "Процентное соотношение (например, 40%)"
                }
              ]
            }
        `;

        const portfolioResult = await model.generateContent(portfolioPrompt);
        const portfolioResponse = await portfolioResult.response;
        let text = portfolioResponse.text();

        // Очистка ответа, если он обернут в markdown
        if (text.includes('```json')) {
            text = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
        }

        const jsonResponse = JSON.parse(text);
        return jsonResponse;

    } catch (error) {
        console.error("Ошибка при генерации крипто-портфеля от Gemini AI:", error);
        return { error: "Не удалось сгенерировать идею для портфеля." };
    }
};
