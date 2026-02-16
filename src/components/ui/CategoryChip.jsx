import React from 'react';

/**
 * DS v3 Category Chip
 * Icon 24 + label, H=64px (icon area 40 + label below)
 */
export const CategoryChip = ({
  icon: Icon,
  emoji,
  label,
  active = false,
  onClick,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 flex-shrink-0
        transition-all duration-200
        ${className}
      `}
    >
      <div
        className={`
          w-10 h-10 rounded-ds-m flex items-center justify-center
          transition-all duration-200
          ${active
            ? 'bg-semantic-cta-primary/10 border-[1.5px] border-semantic-cta-primary'
            : 'bg-base-surface border border-base-divider hover:bg-base-divider'
          }
        `}
      >
        {Icon ? (
          <Icon size={24} className={active ? 'text-semantic-cta-primary' : 'text-base-text-secondary'} />
        ) : emoji ? (
          <span className="text-xl">{emoji}</span>
        ) : null}
      </div>
      <span className={`ds-label-tab ${active ? 'text-semantic-cta-primary' : 'text-base-text-secondary'}`}>
        {label}
      </span>
    </button>
  );
};
