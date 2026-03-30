import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useMap } from '@/hooks/useMap';
import { Button } from '@/components/ui/Button';
import { AddressSearch } from '@/components/ui/AddressSearch';
import { CatalogTab } from '@/components/screens/CatalogTab';
import { Navigation, Map, MapPin, ChevronRight, Package, Search, X } from 'lucide-react';

const DEFAULT_CENTER = { lat: 55.7282, lng: 37.5795 };

/**
 * HomeScreen — unified Radar + Catalog tab (editorial style)
 */
export const HomeScreen = ({
  isActive,
  onApplyRadar,
  onSelectStore,
  onBrowseAll,
  storesInRadius,
  storeProducts,
  radarApplied,
  favorites,
  onToggleFavorite,
  onProductClick,
  onAddToCart,
  shoppingMode,
  selectedStore,
  availableProducts,
  cartItems,
  onIncrementCart,
  onDecrementCart,
  categories,
  userPrefs,
  mapCollapsed,
  onCollapseMap,
  onExpandMap,
}) => {
  const [radarRadius, setRadarRadius] = useState(1.5);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [headerSearch, setHeaderSearch] = useState('');

  useMap({
    enabled: isActive && !mapCollapsed,
    radius: radarRadius,
    center: center,
  });

  const handleAddressSelect = useCallback((data) => {
    setCenter({ lat: data.lat, lng: data.lng });
  }, []);

  const handleResetLocation = useCallback(() => {
    setCenter(DEFAULT_CENTER);
    setAddress('');
  }, []);

  const handleSearch = useCallback(() => {
    if (onApplyRadar) onApplyRadar(center, radarRadius);
  }, [center, radarRadius, onApplyRadar]);

  const handleBrowseAllAndCollapse = useCallback(() => {
    onCollapseMap();
  }, [onCollapseMap]);

  const handleSelectStoreCard = useCallback((storeId) => {
    if (onSelectStore) onSelectStore(storeId);
  }, [onSelectStore]);

  const showStoreList = radarApplied && storesInRadius.length > 0 && !mapCollapsed;

  return (
    <div className="h-full flex flex-col relative animate-fade-in bg-white">
      {/* STATE 3: Compact search bar when map collapsed */}
      {mapCollapsed && (
        <div className="flex items-center gap-2 px-4 pt-3 pb-2 flex-shrink-0">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Поиск товаров..."
              className="w-full pl-10 pr-8 py-2.5 bg-gray-100 rounded-2xl text-sm text-black placeholder-gray-400 border-2 border-transparent focus:outline-none focus:border-acid"
            />
            {headerSearch && (
              <button
                onClick={() => setHeaderSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <motion.button
            onClick={onExpandMap}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="bg-black rounded-2xl px-3 py-2.5 flex items-center gap-1.5 flex-shrink-0"
          >
            <Map size={16} className="text-acid" />
            {storesInRadius.length > 0 && (
              <span className="text-acid text-xs font-bold">{storesInRadius.length}</span>
            )}
          </motion.button>
        </div>
      )}

      {/* Map container */}
      <div
        className={`relative transition-all duration-300 ${
          mapCollapsed
            ? 'h-0 overflow-hidden opacity-0 pointer-events-none'
            : showStoreList
              ? 'h-[55%] flex-shrink-0'
              : 'flex-1'
        }`}
      >
        <div className="absolute top-4 left-4 right-4 z-30">
          <AddressSearch
            value={address}
            onChange={setAddress}
            onSelect={handleAddressSelect}
            placeholder="Введите адрес..."
          />
        </div>

        <motion.button
          onClick={handleResetLocation}
          whileTap={{ scale: 0.88 }}
          className="absolute top-20 right-4 z-30 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center"
        >
          <Navigation size={18} className="text-black" />
        </motion.button>

        <div id="osm-map-home" className="w-full h-full z-10" />

        {/* STATE 1: Radar controls */}
        {(!radarApplied || storesInRadius.length === 0) && (
          <div className="absolute bottom-24 left-4 right-4 z-20">
            <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="ga-label text-gray-500">Радиус перехвата</span>
                <div className="flex items-baseline gap-1">
                  <span className="ga-price text-[28px] text-black leading-none">{radarRadius.toFixed(1)}</span>
                  <span className="ga-body text-sm text-gray-400">км</span>
                </div>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={radarRadius}
                onChange={(e) => setRadarRadius(parseFloat(e.target.value))}
                className="w-full uber-slider"
              />
              <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                <span>0.5 км</span>
                <span>10 км</span>
              </div>
              <Button onClick={handleSearch} fullWidth variant="accent" size="md">
                Искать лоты
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* STATE 2: Store list panel */}
      {showStoreList && (
        <div className="flex-1 bg-white rounded-t-[32px] -mt-4 z-20 overflow-y-auto no-scrollbar pb-32">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-8 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="px-5 pt-2 pb-4 flex items-center justify-between">
            <div>
              <h2 className="ga-title text-[22px]">Магазины рядом</h2>
              <p className="ga-label text-gray-400 mt-1">
                {storesInRadius.length} точек · {radarRadius.toFixed(1)} км
              </p>
            </div>
            <button
              onClick={handleBrowseAllAndCollapse}
              className="text-[11px] font-bold uppercase tracking-wide text-black flex items-center gap-1 bg-acid px-3 py-1.5 rounded-xl"
            >
              Все товары
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Compact radius adjuster */}
          <div className="px-5 pb-4">
            <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3">
              <span className="ga-label text-gray-400 flex-shrink-0">Радиус</span>
              <input
                type="range" min="0.5" max="10" step="0.1"
                value={radarRadius}
                onChange={(e) => setRadarRadius(parseFloat(e.target.value))}
                className="flex-1 uber-slider"
              />
              <span className="ga-price text-[13px] text-black flex-shrink-0 w-12 text-right">
                {radarRadius.toFixed(1)} км
              </span>
              <button
                onClick={handleSearch}
                className="px-3 py-1.5 bg-black text-acid text-[10px] font-bold uppercase rounded-xl flex-shrink-0"
              >
                OK
              </button>
            </div>
          </div>

          {/* Store cards */}
          <div className="px-5 space-y-2">
            {storesInRadius.map((store, i) => {
              const productCount = storeProducts?.[store.id]?.length || 0;
              return (
                <motion.button
                  key={store.id}
                  onClick={() => handleSelectStoreCard(store.id)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04, type: 'spring', stiffness: 300, damping: 28 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-3 text-left"
                >
                  <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden p-1.5">
                    {store.icon ? (
                      <img src={store.icon} alt={store.name} className="w-full h-full object-contain" />
                    ) : (
                      <MapPin size={20} className="text-black" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-black truncate">{store.name}</p>
                    <p className="text-[10px] text-gray-400 truncate mt-0.5">{store.address}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {productCount > 0 && (
                      <div className="flex items-center gap-1 bg-acid px-2.5 py-1 rounded-lg">
                        <Package size={11} className="text-black" />
                        <span className="text-[10px] font-bold text-black">{productCount}</span>
                      </div>
                    )}
                    <ChevronRight size={15} className="text-gray-300" />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* STATE 3: Catalog content */}
      {mapCollapsed && (
        <div className="flex-1 min-h-0">
          <CatalogTab
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
            onProductClick={onProductClick}
            onAddToCart={onAddToCart}
            shoppingMode={shoppingMode}
            selectedStore={selectedStore}
            storeProducts={storeProducts}
            availableProducts={availableProducts}
            radarApplied={radarApplied}
            storesInRadius={storesInRadius}
            cartItems={cartItems}
            onIncrementCart={onIncrementCart}
            onDecrementCart={onDecrementCart}
            categories={categories}
            userPrefs={userPrefs}
            showProductsDirectly={true}
            externalSearch={headerSearch}
            hideSearchBar={true}
          />
        </div>
      )}
    </div>
  );
};
