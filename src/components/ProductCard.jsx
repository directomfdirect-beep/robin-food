import React from 'react';
import { Heart, Plus, Minus, Star } from 'lucide-react';
import { calculatePrices } from '@/utils/price';

/**
 * Product card for catalog grid - Goldapple style
 * Shows +/- quantity controls when item is already in cart
 */
export const ProductCard = ({
  product,
  isFavorite,
  onFavoriteToggle,
  onClick,
  onAddToCart,
  cartItem,
  onIncrement,
  onDecrement,
}) => {
  const priceInfo = calculatePrices(product, 1);
  const inCart = cartItem && cartItem.qty > 0;

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onFavoriteToggle(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (onAddToCart) {
      onAddToCart(product, 1);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (onIncrement) {
      onIncrement(product.id, product.storeId);
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (onDecrement) {
      onDecrement(product.id, product.storeId);
    }
  };

  return (
    <div
      onClick={() => onClick(product)}
      className="flex flex-col gap-3 group active:scale-95 transition-transform text-black cursor-pointer"
    >
      {/* Image */}
      <div className="aspect-[3/4] rounded-[32px] overflow-hidden bg-gray-50 relative border border-gray-100 shadow-sm">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Discount badge */}
        <div className="absolute top-0 left-0 bg-black text-acid px-3 py-1.5 text-[11px] ga-button rounded-br-2xl rounded-tl-[32px]">
          -{priceInfo.discountPercent}%
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          onPointerDown={(e) => e.stopPropagation()}
          className={`
            absolute top-3 right-3 z-20 p-2.5 rounded-full backdrop-blur-md transition-all
            ${isFavorite 
              ? 'bg-error text-white scale-110 shadow-lg' 
              : 'bg-white/30 text-white'
            }
          `}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>

        {/* In-cart badge on image */}
        {inCart && (
          <div className="absolute bottom-3 left-3 bg-acid text-black px-2.5 py-1 rounded-xl text-[10px] font-bold shadow-md">
            В корзине: {cartItem.qty}
          </div>
        )}
      </div>

      {/* Info - Goldapple style */}
      <div className="px-1">
        <h3 className="ga-body-medium text-xs text-gray-800 line-clamp-2 leading-snug min-h-[32px]">
          {product.title}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1">
          <Star size={12} className="text-orange-400 fill-orange-400" />
          <span className="ga-body text-[10px] text-gray-500">
            {product.rating}
            {product.reviewsCount && (
              <span className="text-gray-400"> ({product.reviewsCount})</span>
            )}
          </span>
        </div>

        <div className="flex items-end justify-between mt-1.5">
          <div>
            <span className="ga-price-old text-[11px] text-gray-400 block">
              ₽{product.basePrice}
            </span>
            <span className="ga-price text-lg text-black leading-none block">
              ₽{priceInfo.unitPrice}
            </span>
          </div>

          {/* Cart controls: +/- counter when in cart, single + button otherwise */}
          {inCart ? (
            <div className="flex items-center gap-0 bg-acid rounded-xl overflow-hidden shadow-lg">
              <button
                onClick={handleDecrement}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-2 hover:bg-acid/80 transition-colors active:scale-90"
              >
                <Minus size={14} strokeWidth={2.5} className="text-black" />
              </button>
              <span className="text-sm font-bold text-black min-w-[24px] text-center">
                {cartItem.qty}
              </span>
              <button
                onClick={handleIncrement}
                onPointerDown={(e) => e.stopPropagation()}
                className="p-2 hover:bg-acid/80 transition-colors active:scale-90"
              >
                <Plus size={14} strokeWidth={2.5} className="text-black" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              onPointerDown={(e) => e.stopPropagation()}
              className="bg-black text-acid p-2.5 rounded-xl shadow-lg hover:bg-gray-800 transition-colors active:scale-90"
            >
              <Plus size={16} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
