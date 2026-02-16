import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Clock, X, TrendingUp } from 'lucide-react';
import { CATEGORIES } from '@/data/constants';

const RECENT_KEY = 'rf_recent_searches';
const MAX_RECENT = 10;

/**
 * SearchScreen — search tab with suggest, recent searches, popular categories
 */
export const SearchScreen = ({ onSearch, onCategorySelect }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]'); } catch { return []; }
  });
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const saveRecent = useCallback((term) => {
    const updated = [term, ...recentSearches.filter((s) => s !== term)].slice(0, MAX_RECENT);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  }, [recentSearches]);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (trimmed.length >= 2) {
      saveRecent(trimmed);
      onSearch(trimmed);
    }
  }, [query, onSearch, saveRecent]);

  const handleRecentClick = useCallback((term) => {
    setQuery(term);
    saveRecent(term);
    onSearch(term);
  }, [onSearch, saveRecent]);

  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_KEY);
  }, []);

  const categories = CATEGORIES.filter((c) => c !== 'Все');

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      {/* Search bar */}
      <div className="p-6 pb-4">
        <div className="relative">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Искать товары, магазины..."
            className="w-full pl-12 pr-12 py-4 bg-gray-100 rounded-2xl text-sm font-medium placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 bg-gray-200 rounded-full"
            >
              <X size={14} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Recent searches */}
      {recentSearches.length > 0 && (
        <div className="px-6 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold uppercase text-gray-400">Недавние запросы</h3>
            <button onClick={clearRecent} className="text-[10px] font-bold text-brand-green">
              Очистить
            </button>
          </div>
          <div className="space-y-1">
            {recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleRecentClick(term)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
              >
                <Clock size={16} className="text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">{term}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular categories */}
      <div className="px-6">
        <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-3">Категории</h3>
        <div className="grid grid-cols-2 gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect?.(cat)}
              className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors active:scale-[0.98]"
            >
              <TrendingUp size={18} className="text-brand-green" />
              <span className="font-bold text-sm">{cat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
