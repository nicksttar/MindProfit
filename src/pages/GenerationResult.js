import React from 'react';

// Внутренний компонент для одной карты стратегии
// В этом компоненте изменений нет. Он просто вызывает полученную функцию onClose.
const StrategyCard = ({ name, description, allocation, onClose }) => (
    <div className="col-md-4 mb-4">
        <div className="card bg-dark text-white h-100 position-relative">
            <button
                type="button"
                className="btn-close btn-close-white position-absolute top-0 end-0 m-2"
                aria-label="Close"
                onClick={onClose}
                style={{ zIndex: 10 }}
            ></button>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text text-white-50">{description}</p>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item bg-dark text-white">Акции: {allocation.stocks}</li>
                    <li className="list-group-item bg-dark text-white">Облигации: {allocation.bonds}</li>
                    <li className="list-group-item bg-dark text-white">Другое: {allocation.other}</li>
                </ul>
            </div>
        </div>
    </div>
);

// Внутренний компонент для карты крипто-портфеля
// В этом компоненте изменений нет.
const CryptoPortfolioCard = ({ name, description, assets, onClose }) => (
    <div className="col-md-6 mx-auto">
        <div className="card bg-dark text-white h-100 position-relative">
            <button
                type="button"
                className="btn-close btn-close-white position-absolute top-0 end-0 m-2"
                aria-label="Close"
                onClick={onClose}
                style={{ zIndex: 10 }}
            ></button>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <p className="card-text text-white-50">{description}</p>
                <ul className="list-group list-group-flush">
                    {assets.map(asset => (
                        <li key={asset.ticker} className="list-group-item bg-dark text-white">
                            {asset.coin} ({asset.ticker}): <strong>{asset.allocation}</strong>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);


const GenerationResult = ({ isGenerating, error, result, type, onClose }) => {
    if (isGenerating) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Генерируем идеи...</p>
            </div>
        );
    }

    if (error) {
        // Оборачиваем сообщение об ошибке в контейнер с кнопкой закрытия
        return (
             <div className="position-relative col-md-6 mx-auto">
                 <div className="alert alert-danger text-center position-relative">
                     {error}
                     <button
                         type="button"
                         className="btn-close position-absolute top-0 end-0 m-2"
                         aria-label="Close"
                         onClick={onClose}
                     ></button>
                 </div>
             </div>
        );
    }

    if (!result) {
        return null;
    }

    return (
        <div>
            <h4 className="mb-4 text-center">Сгенерированные идеи</h4>
            <div className="row">
                {type === 'crypto' ? (
                    <CryptoPortfolioCard {...result} onClose={onClose} />
                ) : (
                    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ ЗДЕСЬ:
                    // Мы оборачиваем вызов `onClose` в стрелочную функцию,
                    // чтобы передать `index` конкретной карточки.
                    // Теперь родительский компонент будет знать, какую именно карточку нужно удалить.
                    result.map((strategy, index) => (
                        <StrategyCard 
                            key={index} 
                            {...strategy} 
                            onClose={() => onClose(index)} 
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default GenerationResult;
