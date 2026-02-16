import React, { useState, useCallback } from 'react';
import { ShoppingBag, Tag, X, Loader2, ArrowLeft } from 'lucide-react';
import { CartItem } from '@/components/CartItem';
import { Button } from '@/components/ui/Button';

/**
 * Cart tab with items, promo code, and checkout
 */
export const CartTab = ({
  items,
  stats,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  onContinueShopping,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState(null);

  const isEmpty = items.length === 0;
  
  // Calculate totals (pickup only - no shipping)
  const subtotal = stats.totalPrice;
  const total = Math.max(0, subtotal - promoDiscount);

  // Apply promo code
  const handleApplyPromo = useCallback(async () => {
    if (!promoCode.trim() || isApplyingPromo) return;
    
    setIsApplyingPromo(true);
    setPromoError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock promo codes
    const promoCodes = {
      'ROBIN10': { discount: 10, type: 'percent' },
      'SAVE50': { discount: 50, type: 'fixed' },
      'FIRST': { discount: 15, type: 'percent' },
    };
    
    const promo = promoCodes[promoCode.toUpperCase()];
    
    if (promo) {
      const discount = promo.type === 'percent' 
        ? Math.round(subtotal * promo.discount / 100)
        : promo.discount;
      
      setAppliedPromo(promoCode.toUpperCase());
      setPromoDiscount(discount);
      setPromoCode('');
    } else {
      setPromoError('Промокод не найден');
    }
    
    setIsApplyingPromo(false);
  }, [promoCode, isApplyingPromo, subtotal]);

  // Remove promo code
  const handleRemovePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoDiscount(0);
  }, []);

  return (
    <div className="min-h-full bg-gray-50 text-black animate-fade-in pb-32">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-100">
        <h2 className="ga-title text-2xl">
          Корзина{' '}
          <span className="text-brand-green">({stats.count})</span>
        </h2>
      </div>

      {!isEmpty ? (
        <div className="p-4 space-y-4">
          {/* Items */}
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
            />
          ))}

          {/* Promo code section */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100">
            <h3 className="ga-label text-[10px] text-gray-400 mb-3">ПРОМОКОД</h3>
            
            {appliedPromo ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-brand-green" />
                  <span className="ga-body-medium text-sm text-brand-green">{appliedPromo}</span>
                  <span className="ga-body text-xs text-gray-400">(-₽{promoDiscount})</span>
                </div>
                <button
                  onClick={handleRemovePromo}
                  className="p-1.5 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError(null);
                    }}
                    placeholder="Введите код"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl ga-body text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim() || isApplyingPromo}
                  className="px-5 py-3 bg-black text-white rounded-2xl ga-button text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  {isApplyingPromo ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    'Применить'
                  )}
                </button>
              </div>
            )}
            
            {promoError && (
              <p className="mt-2 ga-body text-xs text-error">{promoError}</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 space-y-3">
            <h3 className="ga-label text-[10px] text-gray-400 mb-4">ИТОГО</h3>
            
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="ga-body text-sm text-gray-500">Подытог</span>
              <span className="ga-body-medium text-sm">₽{subtotal}</span>
            </div>
            
            {/* Promo discount */}
            {promoDiscount > 0 && (
              <div className="flex justify-between items-center">
                <span className="ga-body text-sm text-gray-500">Скидка по промокоду</span>
                <span className="ga-body-medium text-sm text-brand-green">−₽{promoDiscount}</span>
              </div>
            )}
            
            {/* Divider */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="ga-title text-lg">К оплате</span>
                <span className="ga-price text-2xl text-brand-green">₽{total}</span>
              </div>
            </div>
          </div>

          {/* Checkout button */}
          <Button
            onClick={onCheckout}
            fullWidth
            size="lg"
          >
            Оформить заказ
          </Button>

          {/* Continue shopping link */}
          <button
            onClick={onContinueShopping}
            className="w-full flex items-center justify-center gap-2 py-4 ga-body-medium text-sm text-gray-500 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} />
            Продолжить покупки
          </button>
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h3 className="ga-title text-xl text-center mb-2">Корзина пуста</h3>
          <p className="ga-body text-sm text-gray-400 text-center mb-8">
            Добавьте товары из каталога
          </p>
          <Button
            onClick={onContinueShopping}
            variant="primary"
            size="md"
          >
            Начать покупки
          </Button>
        </div>
      )}
    </div>
  );
};
