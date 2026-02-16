import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { calculatePrices } from '@/utils/price';

/**
 * Cart item row with full details
 */
export const CartItem = ({ item, onIncrement, onDecrement, onRemove }) => {
  const priceInfo = calculatePrices(item, item.qty);

  return (
    <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm">
      <div className="flex gap-4">
        {/* Image with discount badge */}
        <div className="relative flex-shrink-0">
          <img
            src={item.image}
            alt={item.title}
            className="w-20 h-20 rounded-2xl object-cover"
          />
          {/* Discount badge */}
          <div className="absolute -top-1 -left-1 bg-black text-acid px-2 py-0.5 rounded-lg ga-button text-[9px]">
            -{priceInfo.discountPercent}%
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h4 className="ga-body-medium text-sm text-black line-clamp-2 mb-1">
            {item.title}
          </h4>
          
          {/* Price breakdown */}
          <div className="flex items-baseline gap-2 mb-2">
            <span className="ga-price text-lg text-brand-green">
              ₽{priceInfo.totalPrice}
            </span>
            <span className="ga-body text-xs text-gray-400">
              {priceInfo.unitPrice} × {item.qty}
            </span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Quantity selector */}
            <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => onDecrement(item.id)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-90 transition-transform"
              >
                <Minus size={14} />
              </button>
              <span className="ga-price text-sm w-6 text-center">{item.qty}</span>
              <button
                onClick={() => onIncrement(item.id)}
                className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm active:scale-90 transition-transform"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Remove button */}
            <button
              onClick={() => onRemove?.(item.id)}
              className="flex items-center gap-1.5 text-error ga-body-medium text-xs hover:bg-red-50 px-3 py-2 rounded-xl transition-colors"
            >
              <Trash2 size={14} />
              Удалить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
