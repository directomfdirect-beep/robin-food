import React from 'react';
import { Bell } from 'lucide-react';

/**
 * Main app header - Goldapple style typography
 */
export const Header = ({ cartTotal = 0, notificationCount = 0, onNotificationsClick }) => {
  return (
    <header className="bg-white border-b border-gray-100 p-6 flex justify-between items-center shrink-0 z-[400] shadow-sm">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black italic uppercase leading-none tracking-tighter">
          РОБИН ФУД
        </h1>
        <span className="text-[8px] font-black uppercase text-brand-green tracking-[0.2em] mt-1 italic">
          Бережное потребление
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onNotificationsClick}
          className="relative p-3 bg-gray-50 rounded-2xl active:scale-90 transition-transform"
        >
          <Bell size={24} />
          {notificationCount > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          ) : (
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-gray-300 rounded-full border-2 border-white" />
          )}
        </button>
        <div className="bg-gray-100 px-4 py-2.5 rounded-2xl ga-price text-black text-sm shadow-inner">
          ₽{cartTotal}
        </div>
      </div>
    </header>
  );
};
