import React from 'react';

/**
 * Badge — editorial acid/black style
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
    success: 'bg-black text-acid',
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
 * Discount badge — acid on black, Bebas Neue
 */
export const DiscountBadge = ({ percent }) => {
  return (
    <div className="absolute top-0 left-0 bg-acid text-black px-3 py-1.5 text-[13px] ga-price rounded-br-2xl rounded-tl-[32px] leading-none">
      -{percent}%
    </div>
  );
};
