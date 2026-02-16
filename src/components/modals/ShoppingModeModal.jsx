import React from 'react';
import { Store, MapPin, X } from 'lucide-react';

/**
 * Shopping Mode Modal — single store vs multi-store selection
 * Shown on first add-to-cart when radar is active
 */
export const ShoppingModeModal = ({ store, onSingleStore, onMultiStore, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-[50px] animate-sheet-up">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        >
          <X size={18} className="text-gray-500" />
        </button>

        <div className="px-6 pb-10 pt-4">
          <h2 className="font-black italic uppercase text-xl leading-tight mb-1">
            Как будете забирать?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Выберите удобный способ получения заказа
          </p>

          {store && (
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <Store size={20} className="text-brand-green" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{store.name}</p>
                <p className="text-xs text-gray-400 truncate">{store.address}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={onSingleStore}
              className="w-full p-5 bg-brand-green text-white rounded-2xl flex items-center gap-3 hover:brightness-95 transition-all active:scale-[0.98]"
            >
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Store size={22} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm text-white mb-0.5">Только этот магазин</p>
                <p className="text-xs text-white/70">Все товары из одной точки</p>
              </div>
            </button>

            <button
              onClick={onMultiStore}
              className="w-full p-5 bg-gray-50 rounded-2xl flex items-center gap-3 hover:bg-gray-100 transition-all active:scale-[0.98] border border-gray-100"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <MapPin size={22} className="text-brand-green" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm mb-0.5">С разных адресов</p>
                <p className="text-xs text-gray-400">Больше товаров, несколько точек самовывоза</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
