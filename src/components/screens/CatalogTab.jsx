import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { MASTER_CATALOG } from '@/data/catalog';
import { catalog as catalogApi, search as searchApi } from '@/lib/api';
import { Search, SlidersHorizontal } from 'lucide-react';

/**
 * Catalog tab with product grid
 * Fetches from API when available, falls back to static MASTER_CATALOG
 */
export const CatalogTab = ({
  favorites,
  onToggleFavorite,
  onProductClick,
  storeId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [apiProducts, setApiProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);

  const loadProducts = useCallback(async () => {
    if (!useApi || !storeId) return;
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'Все') params.category = selectedCategory;
      const data = await catalogApi.getProducts(storeId, params);
      setApiProducts(data.products || data);
    } catch {
      setUseApi(false);
    } finally {
      setLoading(false);
    }
  }, [storeId, selectedCategory, useApi]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredCatalog = useMemo(() => {
    let list = apiProducts || MASTER_CATALOG;

    if (!apiProducts && selectedCategory !== 'Все') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toUpperCase();
      list = list.filter((p) => (p.title || p.name || '').toUpperCase().includes(query));
    }

    return list;
  }, [apiProducts, selectedCategory, searchQuery]);

  return (
    <div className="p-6 animate-fade-in">
      {/* Search */}
      <div className="relative mb-4">
        <Search
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ПОИСК ЛОТОВ..."
          className="w-full pl-12 pr-4 py-3.5 bg-gray-100 rounded-2xl text-[12px] font-bold uppercase placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-green/30"
        />
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Results count */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-[10px] font-bold uppercase text-gray-400">
          {loading ? '...' : `${filteredCatalog.length} лотов`}
        </p>
        <button className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
          <SlidersHorizontal size={14} />
          Сортировка
        </button>
      </div>

      {/* Product grid */}
      {filteredCatalog.length > 0 ? (
        <div className="grid grid-cols-2 gap-5">
          {filteredCatalog.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onFavoriteToggle={onToggleFavorite}
              onClick={onProductClick}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h3 className="ga-title text-lg text-center mb-2">
            Ничего не найдено
          </h3>
          <p className="ga-body text-sm text-gray-400 text-center">
            Попробуйте изменить запрос или категорию
          </p>
        </div>
      )}
    </div>
  );
};
