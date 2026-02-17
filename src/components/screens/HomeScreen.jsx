import React, { useState, useCallback } from 'react';
import { useMap } from '@/hooks/useMap';
import { Button } from '@/components/ui/Button';
import { AddressSearch } from '@/components/ui/AddressSearch';
import { CatalogTab } from '@/components/screens/CatalogTab';
import { Navigation, Map, MapPin, ChevronRight, ChevronDown, ChevronUp, Package } from 'lucide-react';

const DEFAULT_CENTER = { lat: 55.7282, lng: 37.5795 };

/**
 * HomeScreen — unified Radar + Catalog tab.
 *
 * Three visual states:
 * 1. Full map with radar controls (before radar applied)
 * 2. Map (55%) + store list below (after radar applied, before selection)
 * 3. Collapsed map bar + full catalog (after user picks store / "Все товары")
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
}) => {
  const [radarRadius, setRadarRadius] = useState(1.5);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [mapCollapsed, setMapCollapsed] = useState(false);

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
    if (onApplyRadar) {
      onApplyRadar(center, radarRadius);
    }
  }, [center, radarRadius, onApplyRadar]);

  const handleExpandMap = useCallback(() => {
    setMapCollapsed(false);
  }, []);

  const handleBrowseAllAndCollapse = useCallback(() => {
    setMapCollapsed(true);
  }, []);

  const handleSelectStoreCard = useCallback((storeId) => {
    if (onSelectStore) onSelectStore(storeId);
  }, [onSelectStore]);

  const showStoreList = radarApplied && storesInRadius.length > 0 && !mapCollapsed;

  return (
    <div className="h-full flex flex-col relative animate-fade-in bg-[#f8f8f8]">
      {/* ── STATE 3: Collapsed map bar ── */}
      {mapCollapsed && radarApplied && (
        <button
          onClick={handleExpandMap}
          className="mx-4 mt-4 mb-2 bg-brand-green rounded-2xl p-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform shadow-md z-30 flex-shrink-0"
        >
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <Map size={18} className="text-white" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-white text-sm font-bold">Открыть карту</p>
            <p className="text-white/70 text-[10px] font-medium">
              {storesInRadius.length} магазинов в радиусе {radarRadius.toFixed(1)} км
            </p>
          </div>
          <ChevronDown size={20} className="text-white/70" />
        </button>
      )}

      {/* ── Map container (hidden when collapsed, keeps Leaflet alive) ── */}
      <div
        className={`relative transition-all duration-300 ${
          mapCollapsed
            ? 'h-0 overflow-hidden opacity-0 pointer-events-none'
            : showStoreList
              ? 'h-[55%] flex-shrink-0'
              : 'flex-1'
        }`}
      >
        {/* Address search bar */}
        <div className="absolute top-4 left-4 right-4 z-30">
          <AddressSearch
            value={address}
            onChange={setAddress}
            onSelect={handleAddressSelect}
            placeholder="Введите адрес..."
          />
        </div>

        {/* Reset location button */}
        <button
          onClick={handleResetLocation}
          className="absolute top-20 right-4 z-30 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          title="Вернуться к начальной точке"
        >
          <Navigation size={20} className="text-black" />
        </button>

        {/* Map */}
        <div id="osm-map" className="w-full h-full z-10" />

        {/* ── STATE 1: Radar controls (before radar applied) ── */}
        {(!radarApplied || storesInRadius.length === 0) && (
          <div className="absolute bottom-24 left-4 right-4 z-20">
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="ga-label text-gray-500">Радиус перехвата</span>
                <span className="ga-price text-2xl text-black">
                  {radarRadius.toFixed(1)}{' '}
                  <span className="text-base ga-body-medium text-gray-400">км</span>
                </span>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={radarRadius}
                  onChange={(e) => setRadarRadius(parseFloat(e.target.value))}
                  className="w-full uber-slider"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                  <span>0.5 км</span>
                  <span>10 км</span>
                </div>
              </div>
              <Button
                onClick={handleSearch}
                fullWidth
                size="md"
                className="!bg-black !text-white hover:!bg-gray-800 !rounded-2xl !py-4 ga-button"
              >
                Искать лоты
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── STATE 2: Store list panel (radar applied, map visible) ── */}
      {showStoreList && (
        <div className="flex-1 bg-white rounded-t-[32px] -mt-4 z-20 overflow-y-auto no-scrollbar pb-32">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 bg-gray-200 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pt-2 pb-4 flex items-center justify-between">
            <div>
              <h2 className="font-black italic uppercase text-lg leading-tight">
                Магазины рядом
              </h2>
              <p className="text-[10px] font-bold uppercase text-gray-400 mt-1">
                {storesInRadius.length} точек в радиусе {radarRadius.toFixed(1)} км
              </p>
            </div>
            <button
              onClick={handleBrowseAllAndCollapse}
              className="text-xs font-bold text-brand-green flex items-center gap-1"
            >
              Все товары
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Radius adjuster compact */}
          <div className="px-6 pb-4">
            <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3">
              <span className="text-[10px] font-bold uppercase text-gray-400 flex-shrink-0">
                Радиус
              </span>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.1"
                value={radarRadius}
                onChange={(e) => setRadarRadius(parseFloat(e.target.value))}
                className="flex-1 uber-slider"
              />
              <span className="text-sm font-bold text-black flex-shrink-0 w-14 text-right">
                {radarRadius.toFixed(1)} км
              </span>
              <button
                onClick={handleSearch}
                className="px-3 py-1.5 bg-black text-white text-[10px] font-bold uppercase rounded-xl flex-shrink-0"
              >
                Обновить
              </button>
            </div>
          </div>

          {/* Store cards */}
          <div className="px-6 space-y-3">
            {storesInRadius.map((store) => {
              const productCount = storeProducts?.[store.id]?.length || 0;
              return (
                <button
                  key={store.id}
                  onClick={() => handleSelectStoreCard(store.id)}
                  className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors active:scale-[0.98] text-left"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0 overflow-hidden p-1.5">
                    {store.icon ? (
                      <img src={store.icon} alt={store.name} className="w-full h-full object-contain" />
                    ) : (
                      <MapPin size={22} className="text-brand-green" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{store.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{store.address}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="flex items-center gap-1 bg-brand-green/10 px-2.5 py-1 rounded-lg">
                      <Package size={12} className="text-brand-green" />
                      <span className="text-[10px] font-bold text-brand-green">{productCount}</span>
                    </div>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── STATE 3: Catalog content (map collapsed) ── */}
      {mapCollapsed && radarApplied && (
        <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
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
          />
        </div>
      )}
    </div>
  );
};
