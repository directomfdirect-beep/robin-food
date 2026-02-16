import React from 'react';
import { Heart, Plus, Star } from 'lucide-react';
import { calculatePrices } from '@/utils/price';

/**
 * Product card for catalog grid - Goldapple style
 */
export const ProductCard = ({
  product,
  isFavorite,
  onFavoriteToggle,
  onClick,
}) => {
  const priceInfo = calculatePrices(product, 1);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onFavoriteToggle(product.id);
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
          <button className="bg-black text-acid p-2.5 rounded-xl shadow-lg hover:bg-gray-800 transition-colors">
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
