import React from 'react';
import { CATEGORIES } from '@/data/constants';

/**
 * Category filter pills
 * @param {string[]} categories - Optional override for category list (from admin config)
 */
export const CategoryFilter = ({ selected, onSelect, categories }) => {
  const items = categories && categories.length > 0 ? categories : CATEGORIES;

  return (
    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
      {items.map((category) => (
        <button
          key={category}
          onClick={() => onSelect(category)}
          className={`
            px-6 py-2.5 rounded-full whitespace-nowrap text-[10px] 
            font-black uppercase italic transition-all
            ${selected === category 
              ? 'bg-black text-acid' 
              : 'bg-gray-100 text-gray-400'
            }
          `}
        >
          {category}
        </button>
      ))}
    </div>
  );
};
