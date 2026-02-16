import React from 'react';

/**
 * Badge component for labels and tags - Goldapple style
 */
export const Badge = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    primary: 'bg-black text-acid',
    accent: 'bg-acid text-black',
    success: 'bg-brand-green text-white',
    error: 'bg-error text-white',
    warning: 'bg-orange-500 text-white',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[8px]',
    sm: 'px-3 py-1 text-[10px]',
    md: 'px-4 py-1.5 text-xs',
  };

  return (
    <span
      className={`
        ga-label rounded-xl inline-flex items-center gap-1
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

/**
 * Discount badge - Goldapple style
 */
export const DiscountBadge = ({ percent }) => {
  return (
    <div className="absolute top-0 left-0 bg-black text-acid px-3 py-1.5 text-[11px] ga-button rounded-br-2xl rounded-tl-[32px]">
      -{percent}%
    </div>
  );
};
