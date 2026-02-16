import React, { useState, useMemo } from 'react';
import { X, Zap, Clock, Calendar, ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const DISCOUNT_THRESHOLDS = [
  { value: 20, label: '20%', description: 'Минимальная' },
  { value: 30, label: '30%', description: 'Хорошая' },
  { value: 40, label: '40%', description: 'Отличная' },
  { value: 70, label: '70%', description: 'Максимальная' },
];

const FREQUENCY_OPTIONS = [
  { value: 'when_available', label: 'Когда любой доступен', description: 'Выкупаем товары по мере появления', icon: Zap },
  { value: 'full_cart', label: 'Когда всё собрано', description: 'Ждём пока все товары будут доступны', icon: ShoppingCart },
  { value: 'weekly', label: 'Раз в неделю', description: 'Выкупаем доступные каждую неделю', icon: Calendar },
];

/**
 * DS v3 Auto-purchase subscription modal
 */
export const AutoPurchaseModal = ({ cartItems = [], onConfirm, onSkip, onClose }) => {
  const [enabled, setEnabled] = useState(true);
  const [discountThreshold, setDiscountThreshold] = useState(30);
  const [frequency, setFrequency] = useState('full_cart');
  const [selectedItems, setSelectedItems] = useState(() => cartItems.map(item => `${item.id}-${item.storeId}`));

  const allSelected = selectedItems.length === cartItems.length;

  const toggleAll = () => {
    setSelectedItems(allSelected ? [] : cartItems.map(item => `${item.id}-${item.storeId}`));
  };

  const toggleItem = (itemKey) => {
    setSelectedItems(prev => prev.includes(itemKey) ? prev.filter(k => k !== itemKey) : [...prev, itemKey]);
  };

  const groupedItems = useMemo(() => {
    const groups = {};
    cartItems.forEach(item => {
      const storeId = item.storeId || 'unknown';
      if (!groups[storeId]) groups[storeId] = { storeName: item.storeName || 'Магазин', storeAddress: item.storeAddress || '', items: [] };
      groups[storeId].items.push(item);
    });
    return Object.entries(groups);
  }, [cartItems]);

  const handleConfirm = () => {
    if (!enabled || selectedItems.length === 0) { onSkip?.(); return; }
    onConfirm?.({ enabled: true, discountThreshold, frequency, items: selectedItems, createdAt: new Date().toISOString() });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-base-card rounded-t-ds-l animate-sheet-up max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-9 h-1 bg-base-divider rounded-full" />
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-base-surface rounded-full hover:bg-base-divider transition-colors">
          <X size={18} className="text-base-text-secondary" />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-ds-l pb-ds-l">
          {/* Header */}
          <div className="mb-ds-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-semantic-cta-primary/10 rounded-ds-m flex items-center justify-center">
                <Zap size={22} className="text-semantic-cta-primary" />
              </div>
              <div>
                <h2 className="ds-heading-l text-base-text-primary">Автовыкуп</h2>
                <p className="ds-body-s text-base-text-secondary">Подпишитесь на товары</p>
              </div>
            </div>
            <p className="ds-body-m text-base-text-secondary mt-3">
              Мы автоматически выкупим товары когда они снова появятся с нужной скидкой
            </p>
          </div>

          {/* Enable toggle */}
          <div className="bg-base-surface rounded-ds-m p-ds-m mb-ds-m flex items-center justify-between">
            <div>
              <p className="ds-heading-s text-base-text-primary">Включить автовыкуп</p>
              <p className="ds-body-s text-base-text-secondary">Для выбранных товаров</p>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-7 rounded-full transition-colors relative ${enabled ? 'bg-semantic-cta-primary' : 'bg-base-text-tertiary'}`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'left-6' : 'left-1'}`} />
            </button>
          </div>

          {enabled && (
            <>
              {/* Discount threshold */}
              <div className="mb-ds-m">
                <p className="ds-body-xs font-semibold text-base-text-tertiary uppercase mb-2">Минимальная скидка для выкупа</p>
                <div className="grid grid-cols-4 gap-2">
                  {DISCOUNT_THRESHOLDS.map(option => (
                    <button
                      key={option.value}
                      onClick={() => setDiscountThreshold(option.value)}
                      className={`p-3 rounded-ds-s text-center transition-all ${
                        discountThreshold === option.value
                          ? 'bg-semantic-cta-primary text-white'
                          : 'bg-base-surface text-base-text-secondary border border-base-divider hover:bg-base-divider'
                      }`}
                    >
                      <p className="ds-label-price text-lg">{option.label}</p>
                      <p className={`ds-body-xs ${discountThreshold === option.value ? 'text-white/70' : 'text-base-text-tertiary'}`}>{option.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="mb-ds-m">
                <p className="ds-body-xs font-semibold text-base-text-tertiary uppercase mb-2">Когда выкупать</p>
                <div className="space-y-2">
                  {FREQUENCY_OPTIONS.map(option => {
                    const Icon = option.icon;
                    const isSelected = frequency === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setFrequency(option.value)}
                        className={`w-full p-3 rounded-ds-m flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-semantic-cta-primary/[0.08] border-[1.5px] border-semantic-cta-primary'
                            : 'bg-base-surface border border-base-divider hover:bg-base-divider'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-ds-s flex items-center justify-center ${isSelected ? 'bg-semantic-cta-primary/20' : 'bg-base-card'}`}>
                          <Icon size={20} className={isSelected ? 'text-semantic-cta-primary' : 'text-base-text-secondary'} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="ds-heading-s text-base-text-primary">{option.label}</p>
                          <p className="ds-body-xs text-base-text-secondary">{option.description}</p>
                        </div>
                        {isSelected && <Check size={20} className="text-semantic-cta-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product selection */}
              <div className="mb-ds-m">
                <div className="flex items-center justify-between mb-2">
                  <p className="ds-body-xs font-semibold text-base-text-tertiary uppercase">Товары для автовыкупа</p>
                  <button onClick={toggleAll} className="ds-body-s font-bold text-semantic-cta-primary">{allSelected ? 'Снять все' : 'Выбрать все'}</button>
                </div>
                <div className="space-y-3">
                  {groupedItems.map(([storeId, group]) => (
                    <div key={storeId} className="bg-base-surface rounded-ds-m p-ds-s">
                      <p className="ds-body-xs font-semibold text-base-text-tertiary uppercase mb-2">{group.storeAddress.split(',')[0] || group.storeName}</p>
                      <div className="space-y-1.5">
                        {group.items.map(item => {
                          const itemKey = `${item.id}-${item.storeId}`;
                          const isSelected = selectedItems.includes(itemKey);
                          return (
                            <button
                              key={itemKey}
                              onClick={() => toggleItem(itemKey)}
                              className={`w-full p-2 rounded-ds-s flex items-center gap-3 transition-all ${isSelected ? 'bg-base-card border-[1.5px] border-semantic-cta-primary' : 'bg-base-card border border-transparent'}`}
                            >
                              <div className={`w-5 h-5 rounded-ds-xs flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-semantic-cta-primary' : 'bg-base-divider'}`}>
                                {isSelected && <Check size={12} className="text-white" />}
                              </div>
                              <img src={item.image} alt={item.title} className="w-10 h-10 rounded-ds-xs object-cover flex-shrink-0" />
                              <div className="flex-1 text-left min-w-0">
                                <p className="ds-body-s font-medium truncate">{item.title}</p>
                                <p className="ds-body-xs text-base-text-tertiary">{item.qty} шт</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedItems.length > 0 && (
                <div className="bg-semantic-cta-primary/10 rounded-ds-m p-ds-m mb-ds-m">
                  <p className="ds-heading-s text-base-text-primary mb-0.5">
                    Подписка на {selectedItems.length} {selectedItems.length === 1 ? 'товар' : 'товаров'}
                  </p>
                  <p className="ds-body-s text-base-text-secondary">
                    Автовыкуп при скидке от {discountThreshold}%, {frequency === 'weekly' ? 'раз в неделю' : frequency === 'full_cart' ? 'когда всё доступно' : 'по мере появления'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-ds-l pb-ds-3xl pt-ds-m border-t border-base-divider bg-base-card">
          <div className="flex gap-3">
            <Button onClick={onSkip} variant="ghost" size="l" className="flex-1">Пропустить</Button>
            <Button onClick={handleConfirm} variant="primary" size="l" className="flex-1" disabled={enabled && selectedItems.length === 0}>
              {enabled && selectedItems.length > 0 ? 'Подписаться' : 'Продолжить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
