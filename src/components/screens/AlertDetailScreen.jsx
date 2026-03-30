import { useState } from 'react';
import { ArrowLeft, TrendingDown, MapPin, Clock, Beef, Fish, Milk, Sandwich, Apple, Coffee, Carrot, Package } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CATEGORIES } from '@/data/constants';
import { loadAlerts, saveAlerts } from '@/utils/alerts';

const SCHEDULES = [
  { id: 'morning', label: 'Утро', sublabel: '8:00–12:00' },
  { id: 'evening', label: 'Вечер', sublabel: '17:00–21:00' },
  { id: 'all_day', label: 'Весь день', sublabel: '' },
];

const DISCOUNT_OPTIONS = [20, 30, 40, 50];
const RADIUS_OPTIONS = [1, 2, 3, 5, 10];

const CATEGORY_ICONS = {
  'Мясо': Beef,
  'Рыба': Fish,
  'Молоко': Milk,
  'Выпечка': Sandwich,
  'Фрукты': Apple,
  'Напитки': Coffee,
  'Овощи': Carrot,
};

/**
 * AlertDetailScreen — create or edit a smart alert.
 * Persists to localStorage under rf_smart_alerts.
 */
export const AlertDetailScreen = ({ alert, onSave, onBack, onDelete }) => {
  const isNew = !alert?.id;
  const alertData = alert || {};

  const categories = CATEGORIES.filter((c) => c !== 'Все');

  const [category, setCategory] = useState(alertData.category || categories[0]);
  const [minDiscount, setMinDiscount] = useState(alertData.minDiscount || 30);
  const [radiusKm, setRadiusKm] = useState(alertData.radiusKm || 2);
  const [schedule, setSchedule] = useState(alertData.schedule || 'all_day');

  const handleSave = () => {
    const existing = loadAlerts();
    const updatedAlert = {
      id: alertData.id || `al_${Date.now()}`,
      category,
      minDiscount,
      radiusKm,
      schedule,
      enabled: true,
      triggerCount: alertData.triggerCount || 0,
      lastTriggered: alertData.lastTriggered || null,
    };

    let next;
    if (isNew) {
      next = [...existing, updatedAlert];
    } else {
      next = existing.map((a) => (a.id === updatedAlert.id ? updatedAlert : a));
    }

    saveAlerts(next);
    onSave?.(updatedAlert);
    // Single navigation call — onSave handles popScreen in App.jsx
  };

  const handleDelete = () => {
    if (alertData.id) {
      const existing = loadAlerts();
      const next = existing.filter((a) => a.id !== alertData.id);
      saveAlerts(next);
    }
    onDelete?.();
    // Single navigation call
  };

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      {/* Header */}
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="ga-title text-[20px]">
            {isNew ? 'Новый алёрт' : `Алёрт: ${alertData.category}`}
          </h1>
          {!isNew && alertData.triggerCount > 0 && (
            <p className="text-[10px] text-black">Сработал {alertData.triggerCount} раз</p>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Category selection */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Package size={14} className="text-black" />
            <p className="text-[10px] font-bold uppercase text-gray-400">Категория</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => {
              const CatIcon = CATEGORY_ICONS[cat] || Package;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold transition-all active:scale-95 ${
                    category === cat
                      ? 'bg-black text-acid'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <CatIcon size={14} />
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimum discount */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={14} className="text-black" />
            <p className="text-[10px] font-bold uppercase text-gray-400">
              Скидка от — текущий порог: <span className="text-black">{minDiscount}%</span>
            </p>
          </div>
          <div className="flex gap-3">
            {DISCOUNT_OPTIONS.map((d) => (
              <button
                key={d}
                onClick={() => setMinDiscount(d)}
                className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 ${
                  minDiscount === d ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {d}%
              </button>
            ))}
          </div>
        </div>

        {/* Radius */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="text-black" />
            <p className="text-[10px] font-bold uppercase text-gray-400">
              Радиус — текущий: <span className="text-black">{radiusKm} км</span>
            </p>
          </div>
          <div className="flex gap-3">
            {RADIUS_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() => setRadiusKm(r)}
                className={`flex-1 py-3 rounded-2xl font-black text-sm transition-all active:scale-95 ${
                  radiusKm === r ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                }`}
              >
                {r} км
              </button>
            ))}
          </div>
        </div>

        {/* Schedule */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock size={14} className="text-black" />
            <p className="text-[10px] font-bold uppercase text-gray-400">Расписание</p>
          </div>
          <div className="space-y-2">
            {SCHEDULES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSchedule(s.id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 text-left transition-colors active:scale-[0.98] ${
                  schedule === s.id
                    ? 'bg-black text-white'
                    : 'bg-gray-50 text-gray-600'
                }`}
              >
                <Clock size={16} className={schedule === s.id ? 'text-acid' : 'text-gray-300'} />
                <div>
                  <span className="font-bold text-sm">{s.label}</span>
                  {s.sublabel && (
                    <span className={`text-xs ml-2 ${schedule === s.id ? 'text-gray-300' : 'text-gray-400'}`}>
                      {s.sublabel}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Preview summary */}
        <div className="bg-black/5 border border-black/20 rounded-2xl p-4">
          <p className="text-[10px] font-bold uppercase text-black mb-2">Итог алёрта</p>
          <p className="text-sm text-gray-700 leading-snug">
            Уведомить, когда в радиусе <strong>{radiusKm} км</strong> появится{' '}
            <strong>{category}</strong> со скидкой <strong>от {minDiscount}%</strong>
            {schedule !== 'all_day' && (
              <>
                {' '}{schedule === 'morning' ? 'утром (8–12)' : 'вечером (17–21)'}
              </>
            )}
          </p>
        </div>

        <Button onClick={handleSave} fullWidth size="lg">
          {isNew ? 'Создать алёрт' : 'Сохранить'}
        </Button>

        {!isNew && (
          <button
            onClick={handleDelete}
            className="w-full py-3 text-sm font-bold text-error hover:bg-error/5 rounded-2xl transition-colors"
          >
            Удалить алёрт
          </button>
        )}
      </div>
    </div>
  );
};
