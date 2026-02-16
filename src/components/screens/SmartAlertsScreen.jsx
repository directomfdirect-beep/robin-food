import React, { useState } from 'react';
import { ArrowLeft, Bell, BellOff, Plus, Trash2, TrendingDown, Package, ChevronRight } from 'lucide-react';

const MOCK_ALERTS = [
  { id: 'al_1', name: 'Молоко Простоквашино', type: 'price_drop', trigger: 'Снижение цены', enabled: true },
  { id: 'al_2', name: 'Хлеб Бородинский', type: 'back_in_stock', trigger: 'Появление в наличии', enabled: true },
  { id: 'al_3', name: 'Рыба', type: 'price_threshold', trigger: 'Цена ниже ₽200', enabled: false },
  { id: 'al_4', name: 'Фрукты', type: 'price_drop', trigger: 'Снижение цены', enabled: true },
];

const TRIGGER_ICONS = {
  price_drop: TrendingDown,
  back_in_stock: Package,
  price_threshold: TrendingDown,
};

/**
 * SmartAlertsScreen — active alerts list (max 20)
 */
export const SmartAlertsScreen = ({ onBack, onAlertClick, onAdd }) => {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const handleToggle = (id) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDelete = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 pb-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-black italic uppercase text-lg">Умные уведомления</h1>
        </div>
        <span className="text-[10px] font-bold text-gray-400">{alerts.length}/20</span>
      </div>

      <div className="p-6 space-y-3">
        {alerts.map((alert) => {
          const Icon = TRIGGER_ICONS[alert.type] || Bell;
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-2xl flex items-center gap-4 transition-colors ${
                alert.enabled ? 'bg-gray-50' : 'bg-gray-50/50 opacity-60'
              }`}
            >
              <button
                onClick={() => onAlertClick?.(alert)}
                className="flex items-center gap-4 flex-1 min-w-0 text-left"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  alert.enabled ? 'bg-brand-green/10' : 'bg-gray-100'
                }`}>
                  <Icon size={18} className={alert.enabled ? 'text-brand-green' : 'text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{alert.name}</p>
                  <p className="text-[10px] text-gray-400">{alert.trigger}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </button>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleToggle(alert.id)}
                  className={`w-10 h-6 rounded-full transition-colors relative ${
                    alert.enabled ? 'bg-brand-green' : 'bg-gray-300'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    alert.enabled ? 'left-[18px]' : 'left-0.5'
                  }`} />
                </button>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={14} className="text-gray-300" />
                </button>
              </div>
            </div>
          );
        })}

        {alerts.length < 20 && (
          <button
            onClick={onAdd}
            className="w-full p-4 rounded-2xl border border-dashed border-gray-200 flex items-center gap-4 hover:bg-gray-50 transition-colors"
          >
            <Plus size={20} className="text-gray-400" />
            <span className="font-bold text-sm text-gray-500">Добавить уведомление</span>
          </button>
        )}
      </div>
    </div>
  );
};
