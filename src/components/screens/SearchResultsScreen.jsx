import React, { useMemo, useState } from 'react';
import { ArrowLeft, Search, MapPin, ChevronRight, Package } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';

/**
 * SearchResultsScreen — shows Products / Stores / Categories results
 */
export const SearchResultsScreen = ({
  query,
  availableProducts,
  storesInRadius,
  storeProducts,
  favorites,
  onToggleFavorite,
  onProductClick,
  onAddToCart,
  onStoreClick,
  onBack,
}) => {
  const [activeSection, setActiveSection] = useState('products');

  const matchedProducts = useMemo(() => {
    if (!query || !availableProducts) return [];
    const q = query.toUpperCase();
    return availableProducts.filter(
      (p) =>
        (p.title || '').toUpperCase().includes(q) ||
        (p.category || '').toUpperCase().includes(q) ||
        (p.description || '').toUpperCase().includes(q)
    );
  }, [query, availableProducts]);

  const matchedStores = useMemo(() => {
    if (!query || !storesInRadius) return [];
    const q = query.toUpperCase();
    return storesInRadius.filter(
      (s) => s.name.toUpperCase().includes(q) || s.address.toUpperCase().includes(q)
    );
  }, [query, storesInRadius]);

  const sections = [
    { id: 'products', label: 'Товары', count: matchedProducts.length },
    { id: 'stores', label: 'Магазины', count: matchedStores.length },
  ];

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-4 flex items-center gap-3">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5">
          <Search size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700 truncate">{query}</span>
        </div>
      </div>

      {/* Section tabs */}
      <div className="px-4 pt-4 pb-2 flex gap-2">
        {sections.map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
              activeSection === sec.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {sec.label} ({sec.count})
          </button>
        ))}
      </div>

      {/* Products */}
      {activeSection === 'products' && (
        <div className="p-4">
          {matchedProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {matchedProducts.map((product, idx) => (
                <ProductCard
                  key={`${product.id}-${product.storeId || idx}`}
                  product={product}
                  isFavorite={favorites?.includes(product.id)}
                  onFavoriteToggle={onToggleFavorite}
                  onClick={onProductClick}
                  onAddToCart={onAddToCart}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Search size={40} className="mx-auto text-gray-200 mb-4" />
              <p className="font-bold text-sm text-gray-400">Ничего не найдено</p>
              <p className="text-xs text-gray-300 mt-1">Попробуйте другой запрос</p>
            </div>
          )}
        </div>
      )}

      {/* Stores */}
      {activeSection === 'stores' && (
        <div className="p-4 space-y-3">
          {matchedStores.length > 0
            ? matchedStores.map((store) => (
                <button
                  key={store.id}
                  onClick={() => onStoreClick(store.id)}
                  className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                    <MapPin size={22} className="text-brand-green" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{store.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{store.address}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 bg-brand-green/10 px-2.5 py-1 rounded-lg">
                      <Package size={12} className="text-brand-green" />
                      <span className="text-[10px] font-bold text-brand-green">
                        {storeProducts?.[store.id]?.length || 0}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              ))
            : (
              <div className="text-center py-16">
                <MapPin size={40} className="mx-auto text-gray-200 mb-4" />
                <p className="font-bold text-sm text-gray-400">Магазины не найдены</p>
              </div>
            )}
        </div>
      )}
    </div>
  );
};
