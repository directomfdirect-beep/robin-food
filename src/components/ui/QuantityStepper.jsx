import React from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * DS v3 Quantity Stepper
 * [-] count [+], H=32px, W=96px
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
    <div className={`inline-flex items-center h-8 w-24 rounded-ds-s border border-base-divider bg-base-card overflow-hidden ${className}`}>
      <button
        onClick={onDecrement}
        disabled={quantity <= min}
        className="w-8 h-full flex items-center justify-center text-base-text-secondary hover:text-semantic-error disabled:text-base-disabled transition-colors"
      >
        <Minus size={14} />
      </button>
      <span className="flex-1 text-center ds-label-button-s text-base-text-primary">
        {quantity}
      </span>
      <button
        onClick={onIncrement}
        disabled={quantity >= max}
        className="w-8 h-full flex items-center justify-center text-semantic-cta-primary hover:brightness-90 disabled:text-base-disabled transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
