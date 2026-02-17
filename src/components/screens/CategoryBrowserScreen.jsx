import React, { useState, useMemo } from 'react';
import { CATEGORY_SECTIONS } from '@/data/categories';
import { Search } from 'lucide-react';

/**
 * CategoryBrowserScreen — Pyaterochka-style category browser.
 * Shows hierarchical sections with subcategory cards featuring large emoji.
 * Tapping a subcategory navigates to filtered product list.
 */
export const CategoryBrowserScreen = ({ onCategorySelect }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORY_SECTIONS;

    const query = searchQuery.toUpperCase();
    return CATEGORY_SECTIONS.map((section) => ({
      ...section,
      subcategories: section.subcategories.filter(
        (sub) =>
          sub.name.toUpperCase().includes(query) ||
          section.name.toUpperCase().includes(query)
      ),
    })).filter((section) => section.subcategories.length > 0);
  }, [searchQuery]);

  return (
    <div className="pb-28 animate-fade-in">
      {/* Search bar */}
      <div className="sticky top-0 z-20 bg-white px-4 pt-4 pb-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по товарам"
            className="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-2xl text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
          />
        </div>
      </div>

      {/* Category sections */}
      <div className="px-4 space-y-8 mt-2">
        {filteredSections.map((section) => (
          <div key={section.id}>
            {/* Section header */}
            <h2 className="font-black text-xl mb-4 leading-tight">
              {section.name}
            </h2>

            {/* Subcategory grid — 3 columns */}
            <div className="grid grid-cols-3 gap-2.5">
              {section.subcategories.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => onCategorySelect(sub)}
                  className="rounded-2xl overflow-hidden relative flex flex-col justify-between p-2.5 text-left active:scale-[0.96] transition-transform"
                  style={{ backgroundColor: sub.bgColor, aspectRatio: '1 / 1.1' }}
                >
                  {/* Label */}
                  <span className="text-[11px] font-semibold leading-tight text-gray-800 z-10">
                    {sub.name}
                  </span>

                  {/* Large emoji — transparent background, positioned bottom-right */}
                  <div className="absolute bottom-1 right-1 text-[52px] leading-none select-none opacity-90 drop-shadow-sm">
                    {sub.emoji}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

        {filteredSections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search size={32} className="text-gray-300" />
            </div>
            <h3 className="font-bold text-lg text-center mb-2">Ничего не найдено</h3>
            <p className="text-sm text-gray-400 text-center">
              Попробуйте изменить поисковый запрос
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
