import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { MASTER_CATALOG } from '@/data/catalog';
import { catalog as catalogApi } from '@/lib/api';
import { calculatePrices } from '@/utils/price';
import { Search, SlidersHorizontal, Store, MapPin, ShoppingBag } from 'lucide-react';

/**
 * Catalog tab with product grid
 * - When radar is applied: shows products distributed across nearby stores
 * - shoppingMode 'single': filters to selectedStore only
 * - shoppingMode 'multi': shows all products from all stores in radius
 * - Falls back to static MASTER_CATALOG when no radar
 * - Shows per-store cart summary when items are in cart
 */
export const CatalogTab = ({
  favorites,
  onToggleFavorite,
  onProductClick,
  onAddToCart,
  storeId,
  shoppingMode,
  selectedStore,
  storeProducts,
  availableProducts,
  radarApplied,
  storesInRadius,
  cartItems = [],
  onIncrementCart,
  onDecrementCart,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [apiProducts, setApiProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);
  const [selectedStoreTab, setSelectedStoreTab] = useState('all');

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

  // Determine the base product list depending on radar/mode state
  const baseProducts = useMemo(() => {
    if (apiProducts) return apiProducts;

    if (radarApplied && availableProducts && availableProducts.length > 0) {
      return availableProducts;
    }

    return MASTER_CATALOG;
  }, [apiProducts, radarApplied, availableProducts]);

  // In multi mode, allow filtering by store tab
  const productsForTab = useMemo(() => {
    if (shoppingMode !== 'multi' || selectedStoreTab === 'all') return baseProducts;
    if (storeProducts && storeProducts[selectedStoreTab]) {
      return storeProducts[selectedStoreTab];
    }
    return baseProducts;
  }, [shoppingMode, selectedStoreTab, baseProducts, storeProducts]);

  const filteredCatalog = useMemo(() => {
    let list = productsForTab;

    if (!apiProducts && selectedCategory !== 'Все') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toUpperCase();
      list = list.filter((p) => (p.title || p.name || '').toUpperCase().includes(query));
    }

    return list;
  }, [productsForTab, apiProducts, selectedCategory, searchQuery]);

  // Per-store cart summary (grouped by storeId, with address)
  const cartByStore = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return [];
    const groups = {};
    cartItems.forEach((item) => {
      const sid = item.storeId || 'unknown';
      if (!groups[sid]) {
        groups[sid] = {
          storeId: sid,
          storeName: item.storeName || 'Магазин',
          storeAddress: item.storeAddress || '',
          storeIcon: item.storeIcon || item.icon || null,
          count: 0,
          total: 0,
        };
      }
      groups[sid].count += item.qty;
      groups[sid].total += calculatePrices(item, item.qty).totalPrice;
    });
    return Object.values(groups);
  }, [cartItems]);

  // Helper: find cart item for a product
  const getCartItem = useCallback(
    (product) => {
      if (!cartItems) return null;
      return cartItems.find(
        (ci) => ci.id === product.id && ci.storeId === product.storeId
      ) || null;
    },
    [cartItems]
  );

  return (
    <div className="p-6 animate-fade-in">
      {/* Per-store cart summary */}
      {cartByStore.length > 0 && (
        <div className="space-y-2 mb-4">
          {cartByStore.map((group) => (
            <div
              key={group.storeId}
              className="bg-acid/10 border border-acid/30 rounded-2xl p-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                {group.storeIcon ? (
                  <img src={group.storeIcon} alt={group.storeName} className="w-full h-full object-contain" />
                ) : (
                  <ShoppingBag size={16} className="text-brand-green" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">
                  {group.storeName}{group.storeAddress ? ` · ${group.storeAddress}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-lg">
                  {group.count} шт
                </span>
                <span className="text-sm font-bold text-black">
                  ₽{Math.round(group.total)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Single-store banner */}
      {shoppingMode === 'single' && selectedStore && (
        <div className="bg-brand-green/10 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0">
            {selectedStore.icon ? (
              <img src={selectedStore.icon} alt={selectedStore.name} className="w-full h-full object-contain" />
            ) : (
              <Store size={20} className="text-brand-green" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm truncate">{selectedStore.name}</p>
            <p className="text-[10px] text-gray-500 truncate">{selectedStore.address}</p>
          </div>
          <span className="text-[10px] font-bold uppercase text-brand-green bg-brand-green/10 px-2 py-1 rounded-lg">
            Один магазин
          </span>
        </div>
      )}

      {/* Multi-store tabs */}
      {shoppingMode === 'multi' && storesInRadius && storesInRadius.length > 0 && (
        <div className="mb-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedStoreTab('all')}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold uppercase transition-colors ${
                selectedStoreTab === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              Все ({baseProducts.length})
            </button>
            {storesInRadius.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStoreTab(store.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  selectedStoreTab === store.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {store.icon ? (
                  <img src={store.icon} alt="" className="w-3.5 h-3.5 object-contain" />
                ) : (
                  <MapPin size={12} />
                )}
                {store.name} · {store.address} ({(storeProducts?.[store.id] || []).length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Radar info */}
      {radarApplied && !shoppingMode && storesInRadius && storesInRadius.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 flex items-center gap-3">
          <MapPin size={18} className="text-gray-400" />
          <p className="text-xs text-gray-500">
            Найдено <span className="font-bold text-black">{storesInRadius.length}</span> магазинов рядом.
            Добавьте товар в корзину, чтобы выбрать режим покупки.
          </p>
        </div>
      )}

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
        <CategoryFilter selected={selectedCategory} onSelect={setSelectedCategory} />
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
          {filteredCatalog.map((product, idx) => (
            <ProductCard
              key={`${product.id}-${product.storeId || idx}`}
              product={product}
              isFavorite={favorites.includes(product.id)}
              onFavoriteToggle={onToggleFavorite}
              onClick={onProductClick}
              onAddToCart={onAddToCart}
              cartItem={getCartItem(product)}
              onIncrement={onIncrementCart}
              onDecrement={onDecrementCart}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h3 className="ga-title text-lg text-center mb-2">Ничего не найдено</h3>
          <p className="ga-body text-sm text-gray-400 text-center">
            Попробуйте изменить запрос или категорию
          </p>
        </div>
      )}
    </div>
  );
};
