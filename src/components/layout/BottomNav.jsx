import React from 'react';
import { motion } from 'framer-motion';
import { Radar, LayoutGrid, ShoppingBag, Heart, User, Star, Bell, Map, Tag, Home, Search, Gift, Settings } from 'lucide-react';

export const ICON_MAP = {
  Radar, LayoutGrid, ShoppingBag, Heart, User, Star, Bell, Map, Tag, Home, Search, Gift, Settings,
};

const DEFAULT_NAV_ITEMS = [
  { id: 'home', icon: 'Radar', label: 'Главная' },
  { id: 'catalog', icon: 'Search', label: 'Каталог' },
  { id: 'cart', icon: 'ShoppingBag', label: 'Корзина' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
];

/**
 * Bottom navigation — editorial black/acid style
 * Active tab: acid pill background
 */
export const BottomNav = ({ activeTab, onTabChange, cartCount = 0, tabLabels }) => {
  const adminItems = tabLabels && tabLabels.length > 0
    ? tabLabels.filter(t => ['home', 'catalog', 'cart', 'profile'].includes(t.id))
    : null;
  const items = (adminItems && adminItems.length > 0 ? adminItems : DEFAULT_NAV_ITEMS).map((item) => ({
    ...item,
    IconComponent: ICON_MAP[item.icon] || User,
  }));

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 pt-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex justify-around items-center z-[500]">
      {items.map((item) => {
        const isActive = activeTab === item.id;
        const showBadge = item.id === 'cart' && cartCount > 0;

        return (
          <motion.button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="flex flex-col items-center gap-0.5 relative min-w-[60px] py-1"
          >
            <div
              className={`
                w-10 h-8 rounded-2xl flex items-center justify-center transition-colors duration-200
                ${isActive ? 'bg-acid' : 'bg-transparent'}
              `}
            >
              <item.IconComponent
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                className={isActive ? 'text-black' : 'text-gray-400'}
              />
            </div>
            <span className={`text-[8px] font-bold uppercase tracking-wide transition-colors ${isActive ? 'text-black' : 'text-gray-400'}`}>
              {item.label}
            </span>

            {showBadge && (
              <div className="absolute top-0 right-2 bg-black text-acid text-[8px] ga-button w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                {cartCount > 9 ? '9+' : cartCount}
              </div>
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};
