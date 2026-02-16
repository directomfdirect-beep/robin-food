import React, { useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Clock, Heart, Package, ChevronRight } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { CategoryFilter } from '@/components/CategoryFilter';

/**
 * StoreScreen — shows products from a single store
 * Products come from storeProducts[storeId] (radar-distributed)
 */
export const StoreScreen = ({
  store,
  products,
  favorites,
  onToggleFavorite,
  onProductClick,
  onBack,
  onViewAll,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('Все');

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (selectedCategory === 'Все') return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  if (!store) return null;

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      {/* Header */}
      <div className="bg-brand-green p-6 pb-8 relative">
        <button
          onClick={onBack}
          className="absolute top-6 left-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>

        <div className="pt-10 text-white">
          <h1 className="font-black italic uppercase text-2xl leading-tight">{store.name}</h1>
          <div className="flex items-center gap-2 mt-2 text-white/80">
            <MapPin size={14} />
            <span className="text-sm">{store.address}</span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-white/60">
            <Clock size={14} />
            <span className="text-xs">08:00 — 22:00</span>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          <div className="bg-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
            <Package size={14} className="text-white" />
            <span className="text-xs font-bold text-white">{products?.length || 0} товаров</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-4">
        {/* Category filter */}
        <div className="bg-white rounded-2xl shadow-sm p-3 mb-4">
          <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>

        {/* Results count */}
        <div className="flex justify-between items-center mb-4">
          <p className="text-[10px] font-bold uppercase text-gray-400">
            {filteredProducts.length} лотов
          </p>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="text-xs font-bold text-brand-green flex items-center gap-1"
            >
              Все магазины <ChevronRight size={14} />
            </button>
          )}
        </div>

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, idx) => (
              <ProductCard
                key={`${product.id}-${product.storeId || idx}`}
                product={product}
                isFavorite={favorites?.includes(product.id)}
                onFavoriteToggle={onToggleFavorite}
                onClick={onProductClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package size={40} className="mx-auto text-gray-200 mb-4" />
            <p className="font-bold text-sm text-gray-400">Нет товаров в этой категории</p>
          </div>
        )}
      </div>
    </div>
  );
};
