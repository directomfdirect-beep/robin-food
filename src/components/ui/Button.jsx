import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

/**
 * Primary button — editorial black/acid style
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
  const baseStyles = 'ga-button transition-colors flex items-center justify-center gap-2 select-none';

  const variants = {
    primary: 'bg-black text-acid',
    secondary: 'bg-gray-100 text-black',
    accent: 'bg-acid text-black',
    danger: 'bg-error text-white',
    ghost: 'bg-transparent text-black',
  };

  const sizes = {
    sm: 'px-4 py-2.5 text-xs rounded-xl',
    md: 'px-6 py-4 text-sm rounded-2xl',
    lg: 'px-8 py-5 text-base rounded-2xl',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : children}
    </motion.button>
  );
};

/**
 * Icon button — editorial style
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
    default: 'bg-gray-100 text-black',
    active: 'bg-black text-acid',
    accent: 'bg-acid text-black',
    danger: 'bg-error text-white',
  };

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`
        relative p-3 rounded-2xl transition-colors
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      <Icon size={size} />
      {badge !== undefined && badge > 0 && (
        <span className="absolute -top-1 -right-1 bg-acid text-black text-[9px] ga-button w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
          {badge}
        </span>
      )}
    </motion.button>
  );
};
