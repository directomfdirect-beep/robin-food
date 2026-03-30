import { useState, useCallback } from 'react';
import { ArrowLeft, Bell, Plus, Trash2, TrendingDown, MapPin, Zap } from 'lucide-react';
import { loadAlerts, saveAlerts } from '@/utils/alerts';

/**
 * SmartAlertsScreen — real alerts persisted to localStorage.
 * Alerts fire when applyRadar finds matching products.
 */
export const SmartAlertsScreen = ({ onBack, onAlertClick, onAdd }) => {
  const [alerts, setAlerts] = useState(loadAlerts);

  const handleToggle = useCallback((id) => {
    setAlerts((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a));
      saveAlerts(next);
      return next;
    });
  }, []);

  const handleDelete = useCallback((id) => {
    setAlerts((prev) => {
      const next = prev.filter((a) => a.id !== id);
      saveAlerts(next);
      return next;
    });
  }, []);

  const handleAlertClick = (alert) => {
    onAlertClick?.(alert);
  };

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      {/* Header */}
      <div className="p-6 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h1 className="ga-title text-[20px]">Умные алёрты</h1>
          </div>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
            {alerts.length}/20
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-2 ml-12 leading-snug">
          Уведомим когда появится нужная категория<br />с нужной скидкой в вашем районе
        </p>
      </div>

      <div className="p-6 space-y-3">
        {alerts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell size={28} className="text-gray-300" />
            </div>
            <p className="font-bold text-gray-400 text-sm">Нет алёртов</p>
            <p className="text-xs text-gray-300 mt-1">Создайте первый — мы будем следить за скидками</p>
          </div>
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-gray-50 p-4 rounded-2xl transition-opacity ${!alert.enabled ? 'opacity-50' : ''}`}
          >
            <div className="flex items-center gap-3">
              {/* Category icon */}
              <button
                onClick={() => handleAlertClick(alert)}
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 bg-gray-100"
              >
                <Zap size={18} className="text-black" />
              </button>

              {/* Alert info */}
              <button
                onClick={() => handleAlertClick(alert)}
                className="flex-1 min-w-0 text-left"
              >
                <p className="font-bold text-sm">{alert.category}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <TrendingDown size={10} /> скидка от {alert.minDiscount}%
                  </span>
                  <span className="text-[10px] text-gray-300">•</span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <MapPin size={10} /> в радиусе {alert.radiusKm} км
                  </span>
                </div>
                {alert.lastTriggered ? (
                  <p className="text-[10px] text-black mt-0.5">
                    Последний: {alert.lastTriggered} ({alert.triggerCount} раз)
                  </p>
                ) : (
                  <p className="text-[10px] text-gray-300 mt-0.5">Ещё не срабатывал</p>
                )}
              </button>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(alert.id)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    alert.enabled ? 'bg-black' : 'bg-gray-200'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full shadow transition-all ${
                    alert.enabled ? 'left-[18px] bg-acid' : 'left-0.5 bg-white'
                  }`} />
                </button>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={14} className="text-gray-300 hover:text-error" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Add new alert button */}
        {alerts.length < 20 && (
          <button
            onClick={onAdd}
            className="w-full p-4 rounded-2xl border-2 border-dashed border-black/30 flex items-center justify-center gap-3 hover:bg-black/5 transition-colors active:scale-[0.98]"
          >
            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center">
              <Plus size={16} className="text-black" />
            </div>
            <span className="font-bold text-sm text-black">Добавить алёрт</span>
          </button>
        )}

        {/* Info block */}
        <div className="bg-gray-50 rounded-2xl p-4 mt-4">
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Как это работает</p>
          <div className="space-y-2">
            {[
              'Запускаете радар в нужном районе',
              'Robin Food проверяет ваши алёрты',
              'Находим товары под ваши условия',
              'Показываем их первыми в каталоге',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-acid text-black text-[9px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-gray-500">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
