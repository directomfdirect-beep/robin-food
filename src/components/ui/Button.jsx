import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Primary button component - Goldapple style
 */
export const Button = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'ga-button transition-all active:scale-95 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-black text-acid shadow-xl',
    secondary: 'bg-gray-100 text-black',
    accent: 'bg-acid text-black shadow-acid/30 shadow-xl',
    danger: 'bg-red-500 text-white',
    ghost: 'bg-transparent text-black',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-xs rounded-xl',
    md: 'px-6 py-4 text-sm rounded-2xl',
    lg: 'px-8 py-5 text-base rounded-2xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={24} /> : children}
    </button>
  );
};

/**
 * Icon button component - Goldapple style
 */
export const IconButton = ({
  icon: Icon,
  onClick,
  size = 24,
  className = '',
  variant = 'default',
  badge,
  ...props
}) => {
  const variants = {
    default: 'bg-gray-50 text-black hover:bg-gray-100',
    active: 'bg-black text-acid',
    accent: 'bg-acid text-black',
    danger: 'bg-red-500 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative p-3 rounded-2xl transition-all active:scale-90
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      <Icon size={size} />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-brand-green text-white text-[9px] ga-button w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
          {badge}
        </span>
      )}
    </button>
  );
};
