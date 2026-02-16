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
 * Auto-purchase subscription modal
 * Shown after successful checkout, before SuccessScreen
 */
export const AutoPurchaseModal = ({ cartItems = [], onConfirm, onSkip, onClose }) => {
  const [enabled, setEnabled] = useState(true);
  const [discountThreshold, setDiscountThreshold] = useState(30);
  const [frequency, setFrequency] = useState('full_cart');
  const [selectedItems, setSelectedItems] = useState(() =>
    cartItems.map((item) => `${item.id}-${item.storeId || 'default'}`)
  );

  const allSelected = selectedItems.length === cartItems.length;

  const toggleAll = () => {
    setSelectedItems(
      allSelected ? [] : cartItems.map((item) => `${item.id}-${item.storeId || 'default'}`)
    );
  };

  const toggleItem = (itemKey) => {
    setSelectedItems((prev) =>
      prev.includes(itemKey) ? prev.filter((k) => k !== itemKey) : [...prev, itemKey]
    );
  };

  const groupedItems = useMemo(() => {
    const groups = {};
    cartItems.forEach((item) => {
      const storeId = item.storeId || 'default';
      if (!groups[storeId]) {
        groups[storeId] = {
          storeName: item.storeName || 'Магазин',
          storeAddress: item.storeAddress || '',
          items: [],
        };
      }
      groups[storeId].items.push(item);
    });
    return Object.entries(groups);
  }, [cartItems]);

  const handleConfirm = () => {
    if (!enabled || selectedItems.length === 0) {
      onSkip?.();
      return;
    }
    onConfirm?.({
      enabled: true,
      discountThreshold,
      frequency,
      items: selectedItems,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-[50px] animate-sheet-up max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-center pt-3 pb-2 flex-shrink-0">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-10"
        >
          <X size={18} className="text-gray-500" />
        </button>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-brand-green/10 rounded-2xl flex items-center justify-center">
                <Zap size={22} className="text-brand-green" />
              </div>
              <div>
                <h2 className="font-black italic uppercase text-xl leading-tight">Автовыкуп</h2>
                <p className="text-xs text-gray-400">Подпишитесь на товары</p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-3">
              Мы автоматически выкупим товары когда они снова появятся с нужной скидкой
            </p>
          </div>

          {/* Enable toggle */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center justify-between">
            <div>
              <p className="font-bold text-sm">Включить автовыкуп</p>
              <p className="text-xs text-gray-400">Для выбранных товаров</p>
            </div>
            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                enabled ? 'bg-brand-green' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                  enabled ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {enabled && (
            <>
              {/* Discount threshold */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">
                  Минимальная скидка для выкупа
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {DISCOUNT_THRESHOLDS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDiscountThreshold(option.value)}
                      className={`p-3 rounded-xl text-center transition-all ${
                        discountThreshold === option.value
                          ? 'bg-brand-green text-white'
                          : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
                      }`}
                    >
                      <p className="font-bold text-lg">{option.label}</p>
                      <p
                        className={`text-[10px] ${
                          discountThreshold === option.value ? 'text-white/70' : 'text-gray-400'
                        }`}
                      >
                        {option.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Frequency */}
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">Когда выкупать</p>
                <div className="space-y-2">
                  {FREQUENCY_OPTIONS.map((option) => {
                    const Icon = option.icon;
                    const isSelected = frequency === option.value;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setFrequency(option.value)}
                        className={`w-full p-3 rounded-2xl flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-brand-green/[0.08] border-[1.5px] border-brand-green'
                            : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'
                        }`}
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            isSelected ? 'bg-brand-green/20' : 'bg-white'
                          }`}
                        >
                          <Icon
                            size={20}
                            className={isSelected ? 'text-brand-green' : 'text-gray-400'}
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-bold text-sm">{option.label}</p>
                          <p className="text-[10px] text-gray-400">{option.description}</p>
                        </div>
                        {isSelected && <Check size={20} className="text-brand-green" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product selection */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-bold uppercase text-gray-400">
                    Товары для автовыкупа
                  </p>
                  <button onClick={toggleAll} className="text-xs font-bold text-brand-green">
                    {allSelected ? 'Снять все' : 'Выбрать все'}
                  </button>
                </div>
                <div className="space-y-3">
                  {groupedItems.map(([storeId, group]) => (
                    <div key={storeId} className="bg-gray-50 rounded-2xl p-3">
                      <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">
                        {group.storeAddress.split(',')[0] || group.storeName}
                      </p>
                      <div className="space-y-1.5">
                        {group.items.map((item) => {
                          const itemKey = `${item.id}-${item.storeId || 'default'}`;
                          const isSelected = selectedItems.includes(itemKey);
                          return (
                            <button
                              key={itemKey}
                              onClick={() => toggleItem(itemKey)}
                              className={`w-full p-2 rounded-xl flex items-center gap-3 transition-all ${
                                isSelected
                                  ? 'bg-white border-[1.5px] border-brand-green'
                                  : 'bg-white border border-transparent'
                              }`}
                            >
                              <div
                                className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                                  isSelected ? 'bg-brand-green' : 'bg-gray-200'
                                }`}
                              >
                                {isSelected && <Check size={12} className="text-white" />}
                              </div>
                              <img
                                src={item.image}
                                alt={item.title}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                              />
                              <div className="flex-1 text-left min-w-0">
                                <p className="text-sm font-medium truncate">{item.title}</p>
                                <p className="text-[10px] text-gray-400">{item.qty} шт</p>
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
                <div className="bg-brand-green/10 rounded-2xl p-4 mb-4">
                  <p className="font-bold text-sm mb-0.5">
                    Подписка на {selectedItems.length}{' '}
                    {selectedItems.length === 1 ? 'товар' : 'товаров'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Автовыкуп при скидке от {discountThreshold}%,{' '}
                    {frequency === 'weekly'
                      ? 'раз в неделю'
                      : frequency === 'full_cart'
                        ? 'когда всё доступно'
                        : 'по мере появления'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 pb-10 pt-4 border-t border-gray-100 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onSkip}
              className="flex-1 py-4 rounded-2xl font-bold text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors active:scale-[0.98]"
            >
              Пропустить
            </button>
            <Button
              onClick={handleConfirm}
              size="lg"
              className="flex-1"
              disabled={enabled && selectedItems.length === 0}
            >
              {enabled && selectedItems.length > 0 ? 'Подписаться' : 'Продолжить'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
