import React, { useEffect } from 'react';
import { Leaf } from 'lucide-react';

/**
 * Splash screen with brand logo
 */
export const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-[9999]">
      <div className="w-20 h-20 bg-acid rounded-3xl flex items-center justify-center shadow-2xl animate-bounce">
        <Leaf size={40} className="text-black" />
      </div>
      <h1 className="mt-6 text-4xl font-black uppercase italic text-acid tracking-tighter">
        Robin Food
      </h1>
      <p className="ga-body text-sm text-gray-500 mt-2">Спасите еду — спасите бюджет</p>
    </div>
  );
};
