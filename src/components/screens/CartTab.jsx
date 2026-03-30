import { useState, useCallback, useMemo } from 'react';
import robinCatalogBlackLogo from '/robin-catalog-black.png';
import { ShoppingBag, Tag, X, Loader2, ArrowLeft, MapPin, ChevronRight, Plus, Sparkles, Check } from 'lucide-react';
import { CartItem } from '@/components/CartItem';
import { Button } from '@/components/ui/Button';
import { calculatePrices } from '@/utils/price';
import { useRecipeSuggestions } from '@/hooks/useRecipeSuggestions';

/**
 * Cart tab with items, promo code, and checkout
 * In multi-store mode, groups items by store with headers
 */
export const CartTab = ({
  items,
  stats,
  onIncrement,
  onDecrement,
  onRemove,
  onCheckout,
  onContinueShopping,
  shoppingMode,
  availableProducts,
  onAddToCart,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoError, setPromoError] = useState(null);
  const [expandedRecipe, setExpandedRecipe] = useState(null);

  const { suggestions: recipeSuggestions } = useRecipeSuggestions(items, availableProducts);

  const isEmpty = items.length === 0;
  const isMultiStore = shoppingMode === 'multi';

  // Group items by store for multi-store mode (with icon + subtotal)
  const groupedItems = useMemo(() => {
    if (!isMultiStore) return null;
    const groups = {};
    items.forEach((item) => {
      const sid = item.storeId || 'unknown';
      if (!groups[sid]) {
        groups[sid] = {
          storeId: sid,
          storeName: item.storeName || 'Магазин',
          storeAddress: item.storeAddress || '',
          storeIcon: item.storeIcon || item.icon || null,
          items: [],
          subtotal: 0,
        };
      }
      groups[sid].items.push(item);
      groups[sid].subtotal += calculatePrices(item, item.qty).totalPrice;
    });
    return Object.values(groups);
  }, [items, isMultiStore]);

  // Calculate totals (pickup only - no shipping)
  const subtotal = stats.totalPrice;
  const total = Math.max(0, subtotal - promoDiscount);

  // Apply promo code
  const handleApplyPromo = useCallback(async () => {
    if (!promoCode.trim() || isApplyingPromo) return;

    setIsApplyingPromo(true);
    setPromoError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock promo codes
    const promoCodes = {
      ROBIN10: { discount: 10, type: 'percent' },
      SAVE50: { discount: 50, type: 'fixed' },
      FIRST: { discount: 15, type: 'percent' },
    };

    const promo = promoCodes[promoCode.toUpperCase()];

    if (promo) {
      const discount =
        promo.type === 'percent' ? Math.round((subtotal * promo.discount) / 100) : promo.discount;

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

  // Render a single cart item row
  const renderCartItem = (item) => (
    <CartItem
      key={`${item.id}-${item.storeId || ''}`}
      item={item}
      onIncrement={onIncrement}
      onDecrement={onDecrement}
      onRemove={onRemove}
    />
  );

  return (
    <div className="h-full overflow-y-auto bg-gray-50 text-black animate-fade-in pb-32">
      {/* Header */}
      <div className="bg-white p-6 border-b border-gray-100">
        <img src={robinCatalogBlackLogo} alt="Robin Food" className="h-9 object-contain mb-3" />
        <h2 className="ga-title text-2xl">
          Корзина <span className="text-gray-400">({stats.count})</span>
        </h2>
        {isMultiStore && groupedItems && groupedItems.length > 1 && (
          <p className="text-[10px] font-bold uppercase text-gray-400 mt-1">
            {groupedItems.length} точки самовывоза
          </p>
        )}
      </div>

      {!isEmpty ? (
        <div className="p-4 space-y-4">
          {/* Items — grouped by store in multi mode, flat list otherwise */}
          {isMultiStore && groupedItems ? (
            groupedItems.map((group, gIdx) => (
              <div key={group.storeId}>
                {/* Divider between groups */}
                {gIdx > 0 && <div className="border-t border-gray-200 my-4" />}

                {/* Store header with icon and subtotal */}
                <div className="bg-white rounded-2xl p-4 mb-3 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden p-1.5">
                      {group.storeIcon ? (
                        <img src={group.storeIcon} alt={group.storeName} className="w-full h-full object-contain" />
                      ) : (
                        <MapPin size={18} className="text-black" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm truncate">{group.storeName}</p>
                      <p className="text-[10px] text-gray-400 truncate">{group.storeAddress}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-bold text-black">₽{Math.round(group.subtotal)}</p>
                      <p className="text-[10px] text-gray-400">{group.items.length} шт</p>
                    </div>
                  </div>
                </div>

                {/* Items for this store */}
                <div className="space-y-3">
                  {group.items.map(renderCartItem)}
                </div>
              </div>
            ))
          ) : (
            items.map(renderCartItem)
          )}

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
                <span className="ga-body-medium text-sm text-error">−₽{promoDiscount}</span>
              </div>
            )}

            {/* Multi-store pickup note */}
            {isMultiStore && groupedItems && groupedItems.length > 1 && (
              <div className="flex justify-between items-center">
                <span className="ga-body text-sm text-gray-500">Точки самовывоза</span>
                <span className="ga-body-medium text-sm">{groupedItems.length} адреса</span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-100 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="ga-title text-lg">К оплате</span>
                <span className="ga-price text-2xl text-black">₽{total}</span>
              </div>
            </div>
          </div>

          {/* Promo code section */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100">
            <h3 className="ga-label text-[10px] text-gray-400 mb-3">ПРОМОКОД</h3>

            {appliedPromo ? (
              <div className="flex items-center justify-between bg-acid/20 border border-acid/40 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-black" />
                  <span className="ga-body-medium text-sm text-black">{appliedPromo}</span>
                  <span className="ga-body text-xs text-gray-500">(-₽{promoDiscount})</span>
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
                  <Tag
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value.toUpperCase());
                      setPromoError(null);
                    }}
                    placeholder="Введите код"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl ga-body text-sm border-2 border-transparent focus:outline-none focus:border-acid"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim() || isApplyingPromo}
                  className="px-5 py-3 bg-black text-white rounded-2xl ga-button text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  {isApplyingPromo ? <Loader2 size={16} className="animate-spin" /> : 'Применить'}
                </button>
              </div>
            )}

            {promoError && <p className="mt-2 ga-body text-xs text-error">{promoError}</p>}
          </div>

          {/* Checkout button */}
          <Button onClick={onCheckout} fullWidth size="lg">
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

          {/* Recipe Builder — below CTA so it doesn't block conversion */}
          {recipeSuggestions.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-black" />
                <h3 className="text-[10px] font-bold uppercase text-black tracking-wider">
                  Конструктор блюд
                </h3>
              </div>

              {recipeSuggestions.map((recipe) => {
                const isExpanded = expandedRecipe === recipe.id;
                const percent = Math.round(recipe.completionRatio * 100);
                const allDone = recipe.completionRatio >= 1;
                const missingWithProducts = (recipe.missingGroups || []).filter((mg) => mg.product);

                return (
                  <div
                    key={recipe.id}
                    className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedRecipe(isExpanded ? null : recipe.id)}
                      className="w-full p-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl flex-shrink-0">{recipe.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-black text-sm italic uppercase">
                              {allDone ? 'Блюдо готово!' : `Почти ${recipe.name}!`}
                            </p>
                            <ChevronRight
                              size={16}
                              className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            />
                          </div>
                          <p className="text-[10px] text-gray-400">
                            {recipe.matchedCount} из {recipe.totalRequired} ингредиентов
                          </p>
                          <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 bg-acid`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4">
                        {!allDone && missingWithProducts.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">
                              Добавь в корзину
                            </p>
                            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                              {missingWithProducts.map((mg, idx) => {
                                const p = mg.product;
                                if (!p) return null;
                                const price = Math.round(p.price * (1 - (p.discountPercent || 30) / 100));
                                return (
                                  <div
                                    key={idx}
                                    className="flex-shrink-0 w-28 bg-gray-50 rounded-2xl p-2.5 text-center"
                                  >
                                    <div className="w-16 h-16 mx-auto rounded-xl overflow-hidden mb-1.5 bg-white">
                                      <img src={p.image} alt={p.title || p.name} className="w-full h-full object-contain" />
                                    </div>
                                    <p className="text-[10px] font-bold line-clamp-2 leading-snug mb-1">
                                      {p.title || p.name}
                                    </p>
                                    <p className="text-[10px] text-black font-bold">₽{price}</p>
                                    <button
                                      onClick={() => onAddToCart && onAddToCart(p, 1)}
                                      className="mt-1.5 w-full py-1.5 bg-black text-acid rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 active:scale-95"
                                    >
                                      <Plus size={10} /> Добавить
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                            {missingWithProducts.length > 1 && (
                              <button
                                onClick={() => {
                                  missingWithProducts.forEach((mg) => {
                                    if (mg.product && onAddToCart) onAddToCart(mg.product, 1);
                                  });
                                }}
                                className="mt-2 w-full py-2.5 bg-acid text-black rounded-2xl text-[11px] font-black uppercase tracking-wide active:scale-95"
                              >
                                Добавить все ({missingWithProducts.length} шт)
                              </button>
                            )}
                          </div>
                        )}

                        {recipe.steps && recipe.steps.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold uppercase text-gray-400 mb-2">
                              {allDone ? 'Как приготовить' : 'Рецепт'}
                            </p>
                            <div className="space-y-2">
                              {recipe.steps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-3">
                                  <div className="w-5 h-5 rounded-full bg-acid text-black flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                                    {allDone ? <Check size={10} strokeWidth={3} /> : step.step}
                                  </div>
                                  <p className="text-xs text-gray-600 leading-snug pt-0.5">{step.text}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
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
          <Button onClick={onContinueShopping} variant="primary" size="md">
            Начать покупки
          </Button>
        </div>
      )}
    </div>
  );
};
