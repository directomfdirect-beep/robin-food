import React from 'react';

/**
 * Category chip — editorial pill
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
          w-10 h-10 rounded-2xl flex items-center justify-center
          transition-all duration-200
          ${active
            ? 'bg-black border-2 border-black'
            : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
          }
        `}
      >
        {Icon ? (
          <Icon size={20} className={active ? 'text-acid' : 'text-gray-500'} />
        ) : emoji ? (
          <span className="text-xl">{emoji}</span>
        ) : null}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wide ${active ? 'text-black' : 'text-gray-400'}`}>
        {label}
      </span>
    </button>
  );
};
