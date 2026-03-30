import React from 'react';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

/**
 * Main app header — Russo One wordmark, acid accents
 */
export const Header = ({ cartTotal = 0, notificationCount = 0, onNotificationsClick }) => {
  return (
    <header className="bg-white border-b border-gray-100 px-5 py-4 flex justify-between items-center shrink-0 z-[400]">
      <div className="flex flex-col leading-none">
        <h1 className="font-display text-[28px] text-black leading-none tracking-wide uppercase">
          РОБИН ФУД
        </h1>
        <span className="ga-label text-[9px] text-gray-400 mt-0.5">
          Бережное потребление
        </span>
      </div>

      <div className="flex items-center gap-3">
        <motion.button
          onClick={onNotificationsClick}
          whileTap={{ scale: 0.88 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative p-2.5 bg-gray-100 rounded-2xl"
        >
          <Bell size={22} strokeWidth={1.8} />
          {notificationCount > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-acid text-black text-[9px] ga-button rounded-full flex items-center justify-center px-1 border-2 border-white">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          ) : (
            <span className="absolute top-2 right-2 w-2 h-2 bg-acid rounded-full" />
          )}
        </motion.button>

        {cartTotal > 0 && (
          <div className="bg-black text-acid px-3.5 py-2 rounded-2xl ga-price text-[15px] leading-none">
            ₽{cartTotal}
          </div>
        )}
      </div>
    </header>
  );
};
