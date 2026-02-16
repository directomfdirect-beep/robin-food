import React from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Order success celebration screen
 */
export const SuccessScreen = ({ onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center p-8 text-center animate-zoom-in">
      <div className="w-24 h-24 bg-acid rounded-full flex items-center justify-center mb-8 shadow-2xl">
        <CheckCircle size={56} className="text-black" strokeWidth={1.5} />
      </div>

      <h2 className="text-[36px] font-black uppercase italic text-acid leading-none mb-3">
        Заказ оформлен!
      </h2>
      <p className="ga-body text-base text-gray-500 mb-10 max-w-[280px]">
        Мы пришлём уведомление, когда можно забирать
      </p>

      <Button
        onClick={onContinue}
        fullWidth
        size="lg"
        variant="accent"
      >
        К покупкам
      </Button>
    </div>
  );
};
