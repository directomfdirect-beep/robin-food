import React, { useState, useMemo } from 'react';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { MASTER_CATALOG } from '@/data/catalog';

/**
 * FavoritesScreen — tab showing favorite products and stores
 */
export const FavoritesScreen = ({
  favorites,
  onToggleFavorite,
  onProductClick,
  onAddToCart,
}) => {
  const [filter, setFilter] = useState('all');

  const favoriteProducts = useMemo(() => {
    return MASTER_CATALOG.filter((p) => favorites?.includes(p.id));
  }, [favorites]);

  const filters = [
    { id: 'all', label: 'Все', count: favoriteProducts.length },
    { id: 'products', label: 'Товары', count: favoriteProducts.length },
    { id: 'stores', label: 'Магазины', count: 0 },
  ];

  const isEmpty = favoriteProducts.length === 0;

  return (
    <div className="min-h-full bg-white animate-fade-in pb-32">
      {/* Header */}
      <div className="p-6 pb-2">
        <h1 className="font-black italic uppercase text-2xl leading-tight">Избранное</h1>
      </div>

      {/* Filter tabs */}
      <div className="px-6 py-3 flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${
              filter === f.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Content */}
      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-20 px-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart size={40} className="text-gray-300" />
          </div>
          <h3 className="font-black italic uppercase text-xl text-center mb-2">Пусто</h3>
          <p className="text-sm text-gray-400 text-center">
            Добавьте товары в избранное, нажав ★ на карточке товара
          </p>
        </div>
      ) : (
        <div className="px-6 py-2">
          <div className="grid grid-cols-2 gap-4">
            {favoriteProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavorite={true}
                onFavoriteToggle={onToggleFavorite}
                onClick={onProductClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
