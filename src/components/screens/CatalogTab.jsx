import React, { useMemo, useState, useEffect, useCallback } from 'react';
import robinCatalogBlackLogo from '/robin-catalog-black.png';
import { CategoryFilter } from '@/components/CategoryFilter';
import { ProductCard } from '@/components/ProductCard';
import { RecipePromoCard } from '@/components/RecipePromoCard';
import { CategoryBrowserScreen } from '@/components/screens/CategoryBrowserScreen';
import { MASTER_CATALOG } from '@/data/catalog';
import { catalog as catalogApi } from '@/lib/api';
import { calculatePrices } from '@/utils/price';
import { getRecipesForCatalog } from '@/data/recipes';
import {
  Search, SlidersHorizontal, Store, MapPin, ShoppingBag,
  LayoutGrid, List, X, ChevronDown,
} from 'lucide-react';

const SORT_OPTIONS = [
  { id: 'default', label: 'По умолчанию' },
  { id: 'discount', label: 'По скидке' },
  { id: 'expiry', label: 'По сроку' },
  { id: 'price_asc', label: 'Дешевле' },
  { id: 'price_desc', label: 'Дороже' },
];

/**
 * Catalog tab with product grid/list, search, sorting, and category browser.
 * - When radar is applied: shows products distributed across nearby stores
 * - shoppingMode 'single': filters to selectedStore only
 * - shoppingMode 'multi': shows all products from all stores in radius
 * - Falls back to static MASTER_CATALOG when no radar
 * - Shows CategoryBrowserScreen when no search query and no category selected
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
  categories,
  userPrefs,
  onSearch,
  onCategorySelect,
  showProductsDirectly = false,
  externalSearch,
  hideSearchBar = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (externalSearch !== undefined) {
      setSearchQuery(externalSearch);
    }
  }, [externalSearch]);
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [apiProducts, setApiProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(true);
  const [selectedStoreTab, setSelectedStoreTab] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [sortBy, setSortBy] = useState('default');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const isInCatalogMode = showProductsDirectly || searchQuery.trim() !== '' || selectedCategory !== 'Все';

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

  const baseProducts = useMemo(() => {
    if (apiProducts) return apiProducts;
    if (radarApplied && availableProducts && availableProducts.length > 0) {
      return availableProducts;
    }
    return MASTER_CATALOG;
  }, [apiProducts, radarApplied, availableProducts]);

  const orderedCategories = useMemo(() => {
    const base = categories || ['Все', 'Мясо', 'Молоко', 'Выпечка', 'Рыба', 'Фрукты', 'Напитки'];
    if (!userPrefs || !userPrefs.preferredCategories || userPrefs.preferredCategories.length === 0) {
      return base;
    }
    const preferred = userPrefs.preferredCategories;
    const rest = base.filter((c) => c !== 'Все' && !preferred.includes(c));
    return ['Все', ...preferred.filter((c) => base.includes(c)), ...rest];
  }, [categories, userPrefs]);

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

    // Sorting
    if (sortBy === 'discount') {
      list = [...list].sort((a, b) => {
        const da = calculatePrices(a, 1).discountPercent || 0;
        const db = calculatePrices(b, 1).discountPercent || 0;
        return db - da;
      });
    } else if (sortBy === 'expiry') {
      list = [...list].sort((a, b) => {
        const ta = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
        const tb = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
        return ta - tb;
      });
    } else if (sortBy === 'price_asc') {
      list = [...list].sort((a, b) => (calculatePrices(a, 1).unitPrice || 0) - (calculatePrices(b, 1).unitPrice || 0));
    } else if (sortBy === 'price_desc') {
      list = [...list].sort((a, b) => (calculatePrices(b, 1).unitPrice || 0) - (calculatePrices(a, 1).unitPrice || 0));
    }

    return list;
  }, [productsForTab, apiProducts, selectedCategory, searchQuery, sortBy]);

  const catalogRecipes = useMemo(
    () => getRecipesForCatalog(filteredCatalog, 6),
    [filteredCatalog]
  );

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

  const getCartItem = useCallback(
    (product) => {
      if (!cartItems) return null;
      return cartItems.find(
        (ci) => ci.id === product.id && ci.storeId === product.storeId
      ) || null;
    },
    [cartItems]
  );

  const handleCategorySelectFromBrowser = useCallback((subcategory) => {
    if (onCategorySelect) {
      onCategorySelect(subcategory);
    } else {
      setSelectedCategory(subcategory.productCategory || subcategory.name);
    }
  }, [onCategorySelect]);

  const activeSortLabel = SORT_OPTIONS.find((o) => o.id === sortBy)?.label || 'Сортировка';

  return (
    <div className="h-full overflow-y-auto animate-fade-in bg-white pb-24">
      {/* Brand logo header — hidden when search is controlled externally */}
      {!hideSearchBar && (
        <div className="px-4 pt-5 pb-1">
          <img src={robinCatalogBlackLogo} alt="Robin Food" className="h-10 object-contain" />
        </div>
      )}

      {/* Sticky search + controls header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 pt-4 pb-3 space-y-3">
        {!hideSearchBar && (
          <div className="relative">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск товаров..."
              className="w-full pl-10 pr-10 py-3 bg-gray-100 rounded-2xl text-sm placeholder:text-gray-400 border-2 border-transparent focus:outline-none focus:border-acid"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-300 hover:text-gray-500"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}

        {/* Category filter — always visible */}
        <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            categories={orderedCategories}
          />
      </div>

      {/* Category browser — shown when not searching and no category selected */}
      {!isInCatalogMode ? (
        <div className="pb-28">
          {/* Cart summary banners */}
          {cartByStore.length > 0 && (
            <div className="px-4 pt-4 space-y-2">
              {cartByStore.map((group) => (
                <div
                  key={group.storeId}
                  className="bg-acid/10 border border-acid/30 rounded-2xl p-3 flex items-center gap-3"
                >
                  <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden p-1">
                    {group.storeIcon ? (
                      <img src={group.storeIcon} alt={group.storeName} className="w-full h-full object-contain" />
                    ) : (
                      <ShoppingBag size={16} className="text-black" />
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
          <CategoryBrowserScreen onCategorySelect={handleCategorySelectFromBrowser} searchQuery={searchQuery} />
        </div>
      ) : (
        <div className="p-4">
          {/* Single-store banner */}
          {shoppingMode === 'single' && selectedStore && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center overflow-hidden p-1.5 flex-shrink-0">
                {selectedStore.icon ? (
                  <img src={selectedStore.icon} alt={selectedStore.name} className="w-full h-full object-contain" />
                ) : (
                  <Store size={20} className="text-black" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{selectedStore.name}</p>
                <p className="text-[10px] text-gray-500 truncate">{selectedStore.address}</p>
              </div>
              <span className="text-[10px] font-bold uppercase text-black bg-acid px-2 py-1 rounded-lg">
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
                    selectedStoreTab === 'all' ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  Все ({baseProducts.length})
                </button>
                {storesInRadius.map((store) => (
                  <button
                    key={store.id}
                    onClick={() => setSelectedStoreTab(store.id)}
                    className={`flex-shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                      selectedStoreTab === store.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {store.icon ? (
                      <img src={store.icon} alt="" className="w-3.5 h-3.5 object-contain" />
                    ) : (
                      <MapPin size={12} />
                    )}
                    {store.name} ({(storeProducts?.[store.id] || []).length})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results bar: count + sort + view toggle */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-[10px] font-bold uppercase text-gray-400">
              {loading ? '...' : `${filteredCatalog.length} лотов`}
            </p>
            <div className="flex items-center gap-2">
              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortMenu((v) => !v)}
                  className="flex items-center gap-1 text-[10px] font-bold uppercase text-gray-500 bg-gray-100 px-3 py-2 rounded-xl"
                >
                  <SlidersHorizontal size={12} />
                  {activeSortLabel}
                  <ChevronDown size={10} className={`transition-transform ${showSortMenu ? 'rotate-180' : ''}`} />
                </button>
                {showSortMenu && (
                  <div className="absolute right-0 top-9 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 min-w-[160px] overflow-hidden">
                    {SORT_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => { setSortBy(opt.id); setShowSortMenu(false); }}
                        className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-gray-50 ${
                          sortBy === opt.id ? 'text-black' : 'text-gray-700'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid / list toggle */}
              <div className="flex bg-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-black text-white' : 'text-gray-400'}`}
                >
                  <LayoutGrid size={14} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-black text-white' : 'text-gray-400'}`}
                >
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Product grid or list */}
          {filteredCatalog.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-4">
                {(() => {
                  const items = [];
                  let recipeIdx = 0;
                  filteredCatalog.forEach((product, idx) => {
                    items.push(
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
                    );
                    if ((idx + 1) % 10 === 0 && catalogRecipes[recipeIdx]) {
                      items.push(
                        <RecipePromoCard
                          key={`recipe-${recipeIdx}`}
                          recipe={catalogRecipes[recipeIdx]}
                          index={recipeIdx}
                          onProductClick={onProductClick}
                          onAddToCart={onAddToCart}
                          cartItems={cartItems}
                          onIncrementCart={onIncrementCart}
                          onDecrementCart={onDecrementCart}
                        />
                      );
                      recipeIdx++;
                    }
                  });
                  return items;
                })()}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCatalog.map((product, idx) => {
                  const prices = calculatePrices(product, 1);
                  const cartItem = getCartItem(product);
                  return (
                    <button
                      key={`${product.id}-${product.storeId || idx}`}
                      onClick={() => onProductClick(product)}
                      className="w-full bg-white border border-gray-100 rounded-2xl p-3 flex gap-3 items-center text-left active:scale-[0.99] transition-transform shadow-sm"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <img src={product.image} alt={product.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm line-clamp-2 leading-snug mb-1">
                          {product.title}
                        </p>
                        {product.storeName && (
                          <p className="text-[10px] text-gray-400 truncate mb-2">{product.storeName}</p>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="font-black text-base text-black">
                            ₽{prices.unitPrice}
                          </span>
                          <span className="line-through text-xs text-gray-400">
                            ₽{product.basePrice}
                          </span>
                          <span className="bg-acid text-black text-[9px] font-black px-2 py-0.5 rounded-lg">
                            -{prices.discountPercent}%
                          </span>
                        </div>
                      </div>
                      {cartItem ? (
                        <div className="flex items-center gap-1 bg-black/5 rounded-xl px-2 py-1 flex-shrink-0">
                          <ShoppingBag size={12} className="text-black" />
                          <span className="text-xs font-bold text-black">{cartItem.qty}</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); onAddToCart(product, 1); }}
                          className="w-8 h-8 bg-black text-acid rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90"
                        >
                          <span className="text-lg font-black leading-none -mt-0.5">+</span>
                        </button>
                      )}
                    </button>
                  );
                })}
              </div>
            )
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
      )}
    </div>
  );
};
