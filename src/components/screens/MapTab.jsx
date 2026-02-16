import React, { useState, useCallback } from 'react';
import { useMap } from '@/hooks/useMap';
import { Button } from '@/components/ui/Button';
import { AddressSearch } from '@/components/ui/AddressSearch';
import { Navigation } from 'lucide-react';

/**
 * Default center (Комсомольский 40)
 */
const DEFAULT_CENTER = { lat: 55.7282, lng: 37.5795 };

/**
 * Radar/Map tab with Uber-style visualization
 */
export const MapTab = ({ isActive, onSearchCatalog }) => {
  const [radarRadius, setRadarRadius] = useState(1.5);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState(DEFAULT_CENTER);

  // Initialize map when tab is active
  useMap({
    enabled: isActive,
    radius: radarRadius,
    center: center,
  });

  // Handle address selection from autocomplete
  const handleAddressSelect = useCallback((data) => {
    setCenter({
      lat: data.lat,
      lng: data.lng,
    });
  }, []);

  // Reset to default location
  const handleResetLocation = useCallback(() => {
    setCenter(DEFAULT_CENTER);
    setAddress('');
  }, []);

  return (
    <div className="h-full flex flex-col relative animate-fade-in bg-[#f8f8f8]">
      {/* Address search bar at top */}
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
      <div id="osm-map" className="flex-1 w-full h-full z-10" />

      {/* Minimalist radar controls */}
      <div className="absolute bottom-6 left-4 right-4 z-20">
        <div className="bg-white rounded-3xl shadow-xl p-6 space-y-5">
          {/* Radius header */}
          <div className="flex justify-between items-center">
            <span className="ga-label text-gray-500">
              Радиус перехвата
            </span>
            <span className="ga-price text-2xl text-black">
              {radarRadius.toFixed(1)} <span className="text-base ga-body-medium text-gray-400">км</span>
            </span>
          </div>

          {/* Minimalist slider */}
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
            {/* Slider labels */}
            <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
              <span>0.5 км</span>
              <span>10 км</span>
            </div>
          </div>

        {/* Search button */}
        <Button
          onClick={onSearchCatalog}
          fullWidth
          size="md"
          className="!bg-black !text-white hover:!bg-gray-800 !rounded-2xl !py-4 ga-button"
        >
          Искать лоты
        </Button>
        </div>
      </div>
    </div>
  );
};
