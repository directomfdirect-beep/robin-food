import React from 'react';
import { LayoutGrid, Target, ShoppingBag, User } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'catalog', icon: LayoutGrid, label: 'Каталог' },
  { id: 'map', icon: Target, label: 'Радар' },
  { id: 'cart', icon: ShoppingBag, label: 'Корзина' },
  { id: 'profile', icon: User, label: 'Профиль' },
];

/**
 * Bottom navigation bar - Goldapple style
 */
export const BottomNav = ({ activeTab, onTabChange, cartCount = 0 }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-2xl border-t border-gray-100 px-6 py-4 pb-10 flex justify-between items-center z-[500] shadow-lg">
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.id;
        const showBadge = item.id === 'cart' && cartCount > 0;

        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`
              flex flex-col items-center gap-1.5 transition-all relative
              ${isActive ? 'text-black scale-110' : 'text-gray-300'}
            `}
          >
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
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
