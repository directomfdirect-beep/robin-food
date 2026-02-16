import React, { useState, useCallback } from 'react';
import { useMap } from '@/hooks/useMap';
import { Button } from '@/components/ui/Button';
import { AddressSearch } from '@/components/ui/AddressSearch';
import { Navigation, MapPin, ChevronRight, Package } from 'lucide-react';

const DEFAULT_CENTER = { lat: 55.7282, lng: 37.5795 };

/**
 * HomeScreen — map with radar + store list below
 * Combines previous MapTab functionality with store cards
 */
export const HomeScreen = ({
  isActive,
  onApplyRadar,
  onSelectStore,
  onBrowseAll,
  storesInRadius,
  storeProducts,
  radarApplied,
}) => {
  const [radarRadius, setRadarRadius] = useState(1.5);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useMap({
    enabled: isActive,
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

  return (
    <div className="h-full flex flex-col relative animate-fade-in bg-[#f8f8f8]">
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

      {/* Map container */}
      <div
        id="osm-map"
        className={`w-full z-10 transition-all duration-300 ${
          radarApplied && storesInRadius.length > 0 ? 'h-[55%]' : 'flex-1'
        }`}
      />

      {/* Radar controls — shown when no stores found yet */}
      {!radarApplied || storesInRadius.length === 0 ? (
        <div className="absolute bottom-6 left-4 right-4 z-20">
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
      ) : (
        /* Store list — shown after radar applied */
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
              onClick={onBrowseAll}
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
                  onClick={() => onSelectStore(store.id)}
                  className="w-full bg-gray-50 rounded-2xl p-4 flex items-center gap-4 hover:bg-gray-100 transition-colors active:scale-[0.98] text-left"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                    <MapPin size={22} className="text-brand-green" />
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
    </div>
  );
};
