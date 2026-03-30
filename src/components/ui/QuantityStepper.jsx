import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * Quantity stepper — editorial black/acid
 */
export const QuantityStepper = ({
  quantity,
  onIncrement,
  onDecrement,
  min = 0,
  max = 99,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center h-9 rounded-2xl bg-black overflow-hidden ${className}`}>
      <button
        onClick={onDecrement}
        disabled={quantity <= min}
        className="w-9 h-full flex items-center justify-center text-acid disabled:opacity-30 transition-opacity"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className="px-2 min-w-[24px] text-center ga-price text-[15px] text-acid leading-none">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        disabled={quantity >= max}
        className="w-9 h-full flex items-center justify-center text-acid disabled:opacity-30 transition-opacity"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
};
