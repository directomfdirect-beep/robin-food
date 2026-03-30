import React, { useState } from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { NAV_TABS, CATEGORIES } from '@/data/constants';

const NAV_TAB_ICONS = {
  home: 'Radar',
  categories: 'Разделы',
  cart: 'Корзина',
  favorites: 'Избранное',
  profile: 'Профиль',
};

/**
 * Admin editor for navigation tab labels and category filter pills.
 */
export const TabsEditor = ({ tabs, categories, onTabsChange, onCategoriesChange }) => {
  const [newCategory, setNewCategory] = useState('');

  const updateTabLabel = (id, label) => {
    onTabsChange(tabs.map((t) => (t.id === id ? { ...t, label } : t)));
  };

  const resetTabs = () => onTabsChange(NAV_TABS);

  const addCategory = () => {
    const trimmed = newCategory.trim();
    if (!trimmed || categories.includes(trimmed)) return;
    onCategoriesChange([...categories, trimmed]);
    setNewCategory('');
  };

  const removeCategory = (cat) => {
    if (categories.length <= 1) return;
    onCategoriesChange(categories.filter((c) => c !== cat));
  };

  const updateCategory = (index, value) => {
    const next = categories.map((c, i) => (i === index ? value : c));
    onCategoriesChange(next);
  };

  const resetCategories = () => onCategoriesChange(CATEGORIES);

  const moveCategory = (index, dir) => {
    const next = [...categories];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onCategoriesChange(next);
  };

  return (
    <div className="space-y-6">
      {/* Tabs section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-black uppercase">Названия табов</p>
          <button
            onClick={resetTabs}
            className="text-[10px] font-bold uppercase text-gray-400 underline"
          >
            Сбросить
          </button>
        </div>
        <div className="space-y-2">
          {tabs.map((tab) => (
            <div key={tab.id} className="flex items-center gap-3 bg-gray-50 rounded-2xl px-3 py-2.5">
              <div className="w-8 h-8 bg-gray-200 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-[8px] font-bold uppercase text-gray-500 text-center leading-tight px-0.5">
                  {NAV_TAB_ICONS[tab.id] || tab.id}
                </span>
              </div>
              <span className="text-[9px] font-bold uppercase text-gray-400 w-14 flex-shrink-0">
                {tab.id}
              </span>
              <input
                type="text"
                value={tab.label}
                onChange={(e) => updateTabLabel(tab.id, e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-acid/30"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Categories section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-black uppercase">Фильтры каталога</p>
          <button
            onClick={resetCategories}
            className="text-[10px] font-bold uppercase text-gray-400 underline"
          >
            Сбросить
          </button>
        </div>
        <div className="space-y-2 mb-3">
          {categories.map((cat, index) => (
            <div key={index} className="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-2">
              <div className="flex flex-col gap-0.5 flex-shrink-0">
                <button
                  onClick={() => moveCategory(index, -1)}
                  disabled={index === 0}
                  className="text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 5L5 1L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  onClick={() => moveCategory(index, 1)}
                  disabled={index === categories.length - 1}
                  className="text-gray-300 hover:text-gray-600 disabled:opacity-20 transition-colors"
                >
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <input
                type="text"
                value={cat}
                onChange={(e) => updateCategory(index, e.target.value)}
                disabled={index === 0}
                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-acid/30 disabled:bg-gray-100 disabled:text-gray-400"
              />
              {index === 0 ? (
                <div className="w-7 h-7 flex-shrink-0" />
              ) : (
                <button
                  onClick={() => removeCategory(cat)}
                  disabled={categories.length <= 2}
                  className="w-7 h-7 flex items-center justify-center rounded-xl hover:bg-red-100 text-gray-400 hover:text-error disabled:opacity-30 transition-colors flex-shrink-0"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add new category */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCategory()}
            placeholder="Новая категория..."
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-acid/30"
          />
          <button
            onClick={addCategory}
            disabled={!newCategory.trim()}
            className="px-4 py-2 bg-black text-acid rounded-xl text-xs font-bold uppercase disabled:opacity-40 transition-opacity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
