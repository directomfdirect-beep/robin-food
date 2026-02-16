import React, { useState, useMemo, useCallback } from 'react';
import { ArrowLeft, MapPin, CreditCard, Clock, ShoppingBag, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { calculatePrices } from '@/utils/price';

/**
 * OrderConfirmationScreen — multistore summary before payment
 */
export const OrderConfirmationScreen = ({
  cartItems,
  cartStats,
  paymentMethod,
  shoppingMode,
  onConfirm,
  onBack,
  onChangePayment,
}) => {
  const [agreed, setAgreed] = useState(false);
  const [processing, setProcessing] = useState(false);

  const isMultiStore = shoppingMode === 'multi';

  const groupedItems = useMemo(() => {
    const groups = {};
    cartItems.forEach((item) => {
      const sid = item.storeId || 'default';
      if (!groups[sid]) {
        groups[sid] = {
          storeName: item.storeName || 'Магазин',
          storeAddress: item.storeAddress || '',
          items: [],
          total: 0,
        };
      }
      groups[sid].items.push(item);
      groups[sid].total += calculatePrices(item, item.qty).totalPrice;
    });
    return Object.values(groups);
  }, [cartItems]);

  const handleConfirm = useCallback(async () => {
    if (!agreed || processing) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1500));
    if (Math.random() > 0.1) {
      onConfirm();
    } else {
      setProcessing(false);
      alert('Ошибка при обработке платежа. Попробуйте ещё раз.');
    }
  }, [agreed, processing, onConfirm]);

  const paymentLabel =
    paymentMethod === 'sbp' ? 'СБП' : paymentMethod?.includes('pm_') ? 'Банковская карта' : 'Карта';

  return (
    <div className="min-h-full bg-gray-50 animate-fade-in pb-32">
      <div className="bg-white p-6 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-black italic uppercase text-lg">Подтверждение</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Orders per store */}
        {groupedItems.map((group, idx) => (
          <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-brand-green/10 rounded-xl flex items-center justify-center">
                <MapPin size={16} className="text-brand-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{group.storeName}</p>
                <p className="text-[10px] text-gray-400 truncate">{group.storeAddress}</p>
              </div>
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-lg">
                <Clock size={12} className="text-gray-400" />
                <span className="text-[10px] font-bold text-gray-500">15 мин</span>
              </div>
            </div>

            {group.items.map((item) => (
              <div key={`${item.id}-${item.storeId}`} className="flex items-center gap-3 py-2 border-t border-gray-50">
                <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.title}</p>
                  <p className="text-[10px] text-gray-400">{item.qty} шт</p>
                </div>
                <span className="text-sm font-bold">₽{calculatePrices(item, item.qty).totalPrice}</span>
              </div>
            ))}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">Подытог</span>
              <span className="font-bold text-sm">₽{group.total}</span>
            </div>
          </div>
        ))}

        {/* Payment method */}
        <button
          onClick={onChangePayment}
          className="w-full bg-white rounded-3xl p-5 border border-gray-100 flex items-center gap-4"
        >
          <CreditCard size={20} className="text-brand-green" />
          <div className="flex-1 text-left">
            <p className="text-[10px] font-bold uppercase text-gray-400">Оплата</p>
            <p className="font-bold text-sm">{paymentLabel}</p>
          </div>
          <span className="text-xs text-brand-green font-bold">Изменить</span>
        </button>

        {/* Total */}
        <div className="bg-white rounded-3xl p-5 border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Товаров</span>
            <span className="font-bold text-sm">{cartStats.totalQuantity} шт</span>
          </div>
          {isMultiStore && (
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Точки самовывоза</span>
              <span className="font-bold text-sm">{groupedItems.length}</span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-3 mt-2 flex justify-between items-center">
            <span className="font-black italic uppercase text-lg">Итого</span>
            <span className="font-bold text-2xl text-brand-green">₽{cartStats.totalPrice}</span>
          </div>
        </div>

        {/* Terms */}
        <label className="flex items-start gap-3 px-2">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 rounded border-gray-300 text-brand-green focus:ring-brand-green"
          />
          <span className="text-xs text-gray-400">
            Нажимая «Оплатить», я соглашаюсь с условиями оферты и политикой обработки персональных данных
          </span>
        </label>

        <Button
          onClick={handleConfirm}
          fullWidth
          size="lg"
          disabled={!agreed || processing}
        >
          {processing ? (
            <span className="flex items-center gap-2">
              <Loader2 size={20} className="animate-spin" /> Обработка...
            </span>
          ) : (
            `Оплатить ₽${cartStats.totalPrice}`
          )}
        </Button>
      </div>
    </div>
  );
};
