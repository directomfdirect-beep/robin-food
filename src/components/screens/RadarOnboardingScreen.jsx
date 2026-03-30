import { useState, useCallback } from 'react';
import { Navigation, MapPin, ChevronRight } from 'lucide-react';
import { useMap } from '@/hooks/useMap';
import { AddressSearch } from '@/components/ui/AddressSearch';
import { Button } from '@/components/ui/Button';

const DEFAULT_CENTER = { lat: 55.7282, lng: 37.5795 };

/**
 * RadarOnboardingScreen — step 2 of onboarding after BasketBuilder.
 * Shows the full map with radius slider and "Искать лоты" CTA.
 * On submit: calls onComplete(center, radius) which triggers applyRadar + goes to Hub.
 * On skip: calls onComplete(null, null) to go straight to Hub without radar.
 */
export const RadarOnboardingScreen = ({ onComplete }) => {
  const [radarRadius, setRadarRadius] = useState(1.5);
  const [address, setAddress] = useState('');
  const [center, setCenter] = useState(DEFAULT_CENTER);

  useMap({ enabled: true, radius: radarRadius, center, containerId: 'osm-map-radar' });

  const handleAddressSelect = useCallback((data) => {
    setCenter({ lat: data.lat, lng: data.lng });
  }, []);

  const handleResetLocation = useCallback(() => {
    setCenter(DEFAULT_CENTER);
    setAddress('');
  }, []);

  const handleSearch = useCallback(() => {
    onComplete(center, radarRadius);
  }, [center, radarRadius, onComplete]);

  const handleSkip = useCallback(() => {
    onComplete(null, null);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-white flex flex-col z-[4000] animate-slide-in-bottom overflow-hidden">
      {/* Header overlay (onboarding context) */}
      <div className="absolute top-0 inset-x-0 z-30 pt-14 px-6 pointer-events-none">
        <p className="text-[10px] font-bold uppercase text-acid tracking-wider mb-1">
          Шаг 2 из 2
        </p>
        <h1 className="ga-title text-[32px] leading-tight text-black drop-shadow-sm">
          Где ты живёшь?
        </h1>
        <p className="text-gray-500 text-sm mt-1 leading-snug drop-shadow-sm">
          Настрой радиус — найдём скидки рядом с тобой
        </p>
      </div>

      {/* Address search */}
      <div className="absolute top-36 left-4 right-4 z-30">
        <AddressSearch
          value={address}
          onChange={setAddress}
          onSelect={handleAddressSelect}
          placeholder="Введите адрес..."
        />
      </div>

      {/* Reset to default location */}
      <button
        onClick={handleResetLocation}
        className="absolute top-48 right-4 z-30 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
        title="Вернуться к начальной точке"
      >
        <Navigation size={20} className="text-black" />
      </button>

      {/* Map fills most of the screen */}
      <div id="osm-map-radar" className="w-full h-full z-10" />

      {/* Bottom card — radius + CTA */}
      <div className="absolute bottom-0 inset-x-0 z-20 p-4 pb-8">
        <div className="bg-white rounded-[32px] shadow-2xl p-6 space-y-5">
          {/* Radius display */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MapPin size={18} className="text-black" />
              <span className="text-[11px] font-bold uppercase text-gray-500 tracking-wide">
                Радиус поиска
              </span>
            </div>
            <span className="text-2xl font-black text-black">
              {radarRadius.toFixed(1)}{' '}
              <span className="text-base font-bold text-gray-400">км</span>
            </span>
          </div>

          {/* Slider */}
          <div>
            <input
              type="range"
              min="0.5"
              max="10"
              step="0.1"
              value={radarRadius}
              onChange={(e) => setRadarRadius(parseFloat(e.target.value))}
              className="w-full uber-slider"
            />
            <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
              <span>0.5 км</span>
              <span>10 км</span>
            </div>
          </div>

          {/* CTA */}
          <Button onClick={handleSearch} fullWidth size="lg">
            Искать лоты <ChevronRight size={20} className="inline -mt-0.5" />
          </Button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            className="w-full py-2 text-xs font-bold text-gray-400 uppercase tracking-wide"
          >
            Пропустить, настрою позже
          </button>
        </div>
      </div>
    </div>
  );
};
