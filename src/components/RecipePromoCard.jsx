import React, { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp, Plus, Minus, Check } from 'lucide-react';
import { calculatePrices } from '@/utils/price';

const PALETTE = ['#FFF3CD', '#D4EDDA', '#D1ECF1', '#F8D7DA', '#E2D9F3'];

const SLOGANS = [
  'Приготовим сегодня?',
  'Уфф, ужин перестаёт быть томным?',
  'Забираем и готовим?',
  'На ужин самое то?',
  'Всё для идеального обеда?',
  'Возьмём и сделаем?',
];

/**
 * RecipePromoCard — full-width (col-span-2) promo block injected into the catalog grid.
 * - Shows ingredient thumbnails with +/- cart controls
 * - Tapping the card body expands/collapses step-by-step recipe
 * - "В корзину" button adds all ingredients at once
 */
export const RecipePromoCard = ({
  recipe,
  index,
  onProductClick,
  onAddToCart,
  cartItems = [],
  onIncrementCart,
  onDecrementCart,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const bg = PALETTE[index % PALETTE.length];
  const slogan = SLOGANS[index % SLOGANS.length];

  const totalPrice = recipe.ingredientProducts.reduce(
    (sum, p) => sum + (calculatePrices(p, 1).unitPrice || 0),
    0
  );

  const getCartItem = (p) =>
    cartItems.find((ci) => ci.id === p.id && (!p.storeId || ci.storeId === p.storeId)) || null;

  const allInCart = recipe.ingredientProducts.every((p) => {
    const ci = getCartItem(p);
    return ci && ci.qty > 0;
  });

  const handleAddAll = (e) => {
    e.stopPropagation();
    recipe.ingredientProducts.forEach((p) => {
      if (!getCartItem(p)) onAddToCart && onAddToCart(p, 1);
    });
  };

  const handleToggle = () => setIsExpanded((v) => !v);

  return (
    <div
      className="col-span-2 rounded-[28px] p-4 cursor-pointer active:opacity-90 transition-opacity"
      style={{ backgroundColor: bg }}
      onClick={handleToggle}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <p className="font-black text-base uppercase italic leading-tight flex-1 pr-2">
          {recipe.emoji} {recipe.name}
          <span className="normal-case not-italic font-semibold text-sm opacity-60"> — {slogan}</span>
        </p>
        {isExpanded ? (
          <div className="flex items-center gap-1 flex-shrink-0 opacity-40 mt-0.5">
            <span className="text-[10px] font-bold uppercase">рецепт</span>
            <ChevronUp size={18} />
          </div>
        ) : (
          <div className="flex items-center gap-1 flex-shrink-0 opacity-40 mt-0.5">
            <span className="text-[10px] font-bold uppercase">рецепт</span>
            <ChevronDown size={18} />
          </div>
        )}
      </div>

      {/* Ingredient thumbnails */}
      <div
        className="flex gap-3 overflow-x-auto no-scrollbar pb-1"
        onClick={(e) => e.stopPropagation()}
      >
        {recipe.ingredientProducts.map((p) => {
          const prices = calculatePrices(p, 1);
          const shortName = (p.title || p.name || '').split(',')[0].trim();
          const cartItem = getCartItem(p);
          const inCart = cartItem && cartItem.qty > 0;

          return (
            <div
              key={p.id}
              className="flex-shrink-0 flex flex-col items-center gap-1 w-[84px]"
            >
              <button
                onClick={() => onProductClick(p)}
                className="w-[72px] h-[72px] bg-white rounded-2xl overflow-hidden shadow-sm active:scale-95 transition-transform"
              >
                <img
                  src={p.image}
                  alt={shortName}
                  className="w-full h-full object-contain"
                />
              </button>

              <span className="text-[10px] leading-tight text-center line-clamp-2 w-full">
                {shortName}
              </span>

              {/* Price + cart control in one row */}
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-black leading-none">
                  ₽{Math.round(prices.unitPrice || 0)}
                </span>
                {inCart ? (
                  <div className="flex items-center gap-0 bg-acid rounded-lg overflow-hidden shadow-sm">
                    <button
                      onClick={() => onDecrementCart && onDecrementCart(p.id, p.storeId)}
                      className="px-1 py-0.5 active:bg-acid/80"
                    >
                      <Minus size={9} strokeWidth={3} className="text-black" />
                    </button>
                    <span className="text-[10px] font-black text-black px-0.5">{cartItem.qty}</span>
                    <button
                      onClick={() => onIncrementCart && onIncrementCart(p.id, p.storeId)}
                      className="px-1 py-0.5 active:bg-acid/80"
                    >
                      <Plus size={9} strokeWidth={3} className="text-black" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onAddToCart && onAddToCart(p, 1)}
                    className="bg-gray-100 text-black p-1 rounded-lg shadow-sm hover:bg-gray-200 transition-colors active:scale-90"
                  >
                    <Plus size={12} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer: total price + cart button */}
      <div
        className="mt-3 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-black text-lg">₽{Math.round(totalPrice)}</span>
        <button
          onClick={handleAddAll}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl active:scale-95 transition-all ${
            allInCart
              ? 'bg-black text-white'
              : 'bg-black text-acid'
          }`}
        >
          {allInCart ? <Check size={14} /> : <ShoppingCart size={14} />}
          <span className="text-[12px] font-black">
            {allInCart ? 'В корзине' : 'В корзину'}
          </span>
        </button>
      </div>

      {/* Expandable recipe steps */}
      {isExpanded && recipe.steps?.length > 0 && (
        <div className="mt-4 pt-3 border-t border-black/10 space-y-2">
          <p className="text-[10px] font-bold uppercase opacity-50 mb-2">Как приготовить</p>
          {recipe.steps.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full bg-black text-acid flex-shrink-0 flex items-center justify-center text-[10px] font-black">
                {step.step}
              </div>
              <p className="text-xs leading-snug text-gray-700 pt-0.5">{step.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
