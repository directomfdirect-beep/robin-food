import { useState } from 'react';
import { ChevronRight, ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CATEGORY_OPTIONS = [
  { id: 'Мясо', emoji: '🥩', label: 'Мясо' },
  { id: 'Рыба', emoji: '🐟', label: 'Рыба' },
  { id: 'Молоко', emoji: '🥛', label: 'Молоко' },
  { id: 'Выпечка', emoji: '🍞', label: 'Выпечка' },
  { id: 'Фрукты', emoji: '🍎', label: 'Фрукты' },
  { id: 'Напитки', emoji: '🧃', label: 'Напитки' },
  { id: 'Овощи', emoji: '🥦', label: 'Овощи' },
  { id: 'Заморозка', emoji: '❄️', label: 'Заморозка' },
  { id: 'Готовая еда', emoji: '🍱', label: 'Готовая еда' },
];

const FAMILY_SIZES = [
  { id: 1, label: '1' },
  { id: 2, label: '2' },
  { id: 3, label: '3' },
  { id: 4, label: '4+' },
];

/**
 * Basket Builder — user picks categories and family size.
 * Used both during onboarding (no onBack) and in Profile → Мои предпочтения (with onBack).
 */
export const BasketBuilderScreen = ({ onComplete, onBack, initialPrefs }) => {
  const [selected, setSelected] = useState(() => new Set(initialPrefs?.preferredCategories || []));
  const [familySize, setFamilySize] = useState(initialPrefs?.familySize || 2);

  const toggleCategory = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleContinue = () => {
    onComplete({
      preferredCategories: Array.from(selected),
      familySize,
    });
  };

  const canContinue = selected.size > 0;

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[4000] animate-slide-in-bottom overflow-hidden">
      {/* Top gradient accent */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-acid/20 to-transparent pointer-events-none" />

      {/* Back button — only shown when used from profile */}
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-12 left-5 z-10 p-2.5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div className="relative flex-1 overflow-y-auto px-6 pt-16 pb-40">
        {/* Headline */}
        <div className="mb-8">
          <p className="text-[10px] font-bold uppercase text-acid tracking-wider mb-2">Персонализация</p>
          <h1 className="ga-title text-[36px] leading-tight">
            Что ты обычно<br />покупаешь?
          </h1>
          <p className="text-gray-400 text-sm mt-3 leading-snug">
            Выбери категории — покажем самые свежие скидки первыми
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {CATEGORY_OPTIONS.map((cat) => {
            const isActive = selected.has(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`
                  relative flex flex-col items-center justify-center gap-2 p-4 rounded-[28px]
                  transition-all duration-200 active:scale-95
                  ${isActive
                    ? 'bg-black text-white shadow-lg scale-[1.03]'
                    : 'bg-gray-50 text-gray-800 border border-gray-100'
                  }
                `}
              >
                {isActive && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-acid rounded-full flex items-center justify-center">
                    <Check size={11} strokeWidth={3} className="text-black" />
                  </div>
                )}
                <span className="text-3xl">{cat.emoji}</span>
                <span className={`text-[11px] font-bold uppercase ${isActive ? 'text-acid' : 'text-gray-600'}`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Family size */}
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase text-gray-400 mb-3">Семья</p>
          <div className="flex gap-3">
            {FAMILY_SIZES.map((size) => (
              <button
                key={size.id}
                onClick={() => setFamilySize(size.id)}
                className={`
                  flex-1 py-3 rounded-2xl font-black text-sm transition-all active:scale-95
                  ${familySize === size.id ? 'bg-black text-acid' : 'bg-gray-100 text-gray-500'}
                `}
              >
                {size.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">человек</p>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div className="absolute bottom-0 inset-x-0 p-6 bg-white/90 backdrop-blur-md border-t border-gray-100">
        {!canContinue && (
          <p className="text-center text-xs text-gray-400 mb-3 font-medium">
            Выбери хотя бы одну категорию
          </p>
        )}
        <Button onClick={handleContinue} fullWidth size="lg" disabled={!canContinue}>
          {onBack ? 'Сохранить' : <>Показать скидки <ChevronRight size={20} className="inline -mt-0.5" /></>}
        </Button>

        {!onBack && (
          <button
            onClick={() => onComplete({ preferredCategories: [], familySize: 1 })}
            className="w-full mt-3 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide"
          >
            Пропустить
          </button>
        )}
      </div>
    </div>
  );
};
