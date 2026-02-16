import React, { useState } from 'react';
import { ArrowLeft, Bell, TrendingDown, Package, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const TRIGGER_TYPES = [
  { id: 'price_drop', label: 'Снижение цены', icon: TrendingDown },
  { id: 'back_in_stock', label: 'Появление в наличии', icon: Package },
  { id: 'price_threshold', label: 'Цена ниже порога', icon: TrendingDown },
];

const SCHEDULES = [
  { id: 'morning', label: 'Утро (8:00–12:00)' },
  { id: 'evening', label: 'Вечер (17:00–21:00)' },
  { id: 'all_day', label: 'Целый день' },
];

/**
 * AlertDetailScreen — edit alert trigger, schedule, history
 */
export const AlertDetailScreen = ({ alert, onSave, onBack, onDelete }) => {
  const alertData = alert || { name: '', type: 'price_drop', schedule: 'all_day', threshold: '' };
  const [trigger, setTrigger] = useState(alertData.type);
  const [schedule, setSchedule] = useState(alertData.schedule || 'all_day');
  const [threshold, setThreshold] = useState(alertData.threshold || '');

  const MOCK_HISTORY = [
    { date: '10.02.2026', event: 'Снижение цены: ₽189 → ₽149' },
    { date: '08.02.2026', event: 'Снижение цены: ₽210 → ₽189' },
  ];

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      <div className="p-6 pb-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black italic uppercase text-lg truncate">{alertData.name || 'Уведомление'}</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Trigger type */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">Тип триггера</p>
          <div className="space-y-2">
            {TRIGGER_TYPES.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTrigger(t.id)}
                  className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-colors text-left ${
                    trigger === t.id
                      ? 'bg-brand-green/[0.08] border-[1.5px] border-brand-green'
                      : 'bg-gray-50 border border-gray-100'
                  }`}
                >
                  <Icon size={18} className={trigger === t.id ? 'text-brand-green' : 'text-gray-400'} />
                  <span className={`font-bold text-sm ${trigger === t.id ? 'text-brand-green' : ''}`}>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Threshold (if price_threshold) */}
        {trigger === 'price_threshold' && (
          <div>
            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Порог цены (₽)</p>
            <input
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              placeholder="200"
              className="w-full p-4 bg-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-green/30"
            />
          </div>
        )}

        {/* Schedule */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">Расписание</p>
          <div className="space-y-2">
            {SCHEDULES.map((s) => (
              <button
                key={s.id}
                onClick={() => setSchedule(s.id)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 text-left transition-colors ${
                  schedule === s.id ? 'bg-black text-white' : 'bg-gray-50 text-gray-500'
                }`}
              >
                <Clock size={16} />
                <span className="font-bold text-sm">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* History */}
        <div>
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">История</p>
          {MOCK_HISTORY.length > 0 ? (
            <div className="space-y-2">
              {MOCK_HISTORY.map((h, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                  <Bell size={14} className="text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{h.event}</p>
                    <p className="text-[10px] text-gray-400">{h.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">Пока нет событий</p>
          )}
        </div>

        <Button onClick={() => onSave?.({ trigger, schedule, threshold })} fullWidth size="lg">
          Сохранить
        </Button>

        <button
          onClick={onDelete}
          className="w-full py-3 text-sm font-bold text-error hover:bg-error/5 rounded-2xl transition-colors"
        >
          Удалить уведомление
        </button>
      </div>
    </div>
  );
};
