import React from 'react';
import { Store, MapPin, X } from 'lucide-react';

/**
 * DS v3 Shopping Mode Modal
 * Single store vs multi-store selection
 */
export const ShoppingModeModal = ({ store, onSingleStore, onMultiStore, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-base-card rounded-t-ds-l animate-sheet-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 bg-base-divider rounded-full" />
        </div>

        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-base-surface rounded-full hover:bg-base-divider transition-colors">
          <X size={18} className="text-base-text-secondary" />
        </button>

        <div className="px-ds-l pb-ds-3xl pt-ds-m">
          <h2 className="ds-heading-l text-base-text-primary mb-1">Как будете забирать?</h2>
          <p className="ds-body-m text-base-text-secondary mb-ds-2xl">Выберите удобный способ получения заказа</p>

          {store && (
            <div className="bg-base-surface rounded-ds-m p-ds-m mb-ds-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-base-card rounded-ds-s flex items-center justify-center shadow-elevation-1">
                <Store size={20} className="text-semantic-cta-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="ds-heading-s text-base-text-primary truncate">{store.name}</p>
                <p className="ds-body-s text-base-text-secondary truncate">{store.address}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button onClick={onSingleStore} className="w-full p-ds-l bg-semantic-cta-primary text-white rounded-ds-m flex items-center gap-3 hover:brightness-95 transition-all active:scale-[0.98]">
              <div className="w-10 h-10 bg-white/10 rounded-ds-s flex items-center justify-center">
                <Store size={22} />
              </div>
              <div className="flex-1 text-left">
                <p className="ds-heading-s text-white mb-0.5">Только этот магазин</p>
                <p className="ds-body-s text-white/70">Все товары из одной точки</p>
              </div>
            </button>

            <button onClick={onMultiStore} className="w-full p-ds-l bg-base-surface rounded-ds-m flex items-center gap-3 hover:bg-base-divider transition-all active:scale-[0.98] border border-base-divider">
              <div className="w-10 h-10 bg-base-card rounded-ds-s flex items-center justify-center shadow-elevation-1">
                <MapPin size={22} className="text-semantic-cta-primary" />
              </div>
              <div className="flex-1 text-left">
                <p className="ds-heading-s text-base-text-primary mb-0.5">С разных адресов</p>
                <p className="ds-body-s text-base-text-secondary">Больше товаров, несколько точек самовывоза</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
