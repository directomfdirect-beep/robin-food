import React from 'react';
import { MapPin, X } from 'lucide-react';

/**
 * DS v3 Store Banner — shows selected store with option to clear
 */
export const StoreBanner = ({ store, onClear }) => {
  if (!store) return null;

  return (
    <div className="bg-semantic-cta-primary text-white px-ds-m py-ds-s flex items-center justify-between rounded-ds-m mb-ds-m shadow-cta-primary animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-ds-s">
          <MapPin size={18} />
        </div>
        <div>
          <p className="ds-body-xs font-semibold opacity-80 uppercase">
            Вы выбрали магазин
          </p>
          <p className="ds-heading-s text-white">
            {store.name} на {store.address.split(',')[0]}
          </p>
        </div>
      </div>
      {onClear && (
        <button onClick={onClear} className="bg-white/20 p-2 rounded-ds-s hover:bg-white/30 transition-colors">
          <X size={16} />
        </button>
      )}
    </div>
  );
};
