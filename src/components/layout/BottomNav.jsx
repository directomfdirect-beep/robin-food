import React from 'react';
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Главная' },
  { id: 'search', icon: Search, label: 'Поиск' },
  { id: 'cart', icon: ShoppingBag, label: 'Корзина' },
  { id: 'favorites', icon: Heart, label: 'Избранное' },
  { id: 'profile', icon: User, label: 'Профиль' },
];

/**
 * Bottom navigation bar — 5 tabs per Navigation v1.4.5
 */
export const BottomNav = ({ activeTab, onTabChange, cartCount = 0 }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-100 px-4 py-3 pb-9 flex justify-between items-center z-[500] shadow-lg">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const showBadge = item.id === 'cart' && cartCount > 0;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`
              flex flex-col items-center gap-1 transition-all relative min-w-[48px]
              ${isActive ? 'text-black scale-110' : 'text-gray-300'}
            `}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span
              className={`
                ga-label text-[8px]
                ${isActive ? 'opacity-100' : 'opacity-0'}
              `}
            >
              {item.label}
            </span>
            {showBadge && (
              <div className="absolute -top-1 -right-1 bg-brand-green text-white text-[8px] ga-button w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount}
              </div>
            )}
          </button>
        );
      })}
    </nav>
  );
};
