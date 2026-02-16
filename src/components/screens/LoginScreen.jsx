import React, { useState } from 'react';
import { formatPhone, isValidPhone } from '@/utils/phone';
import { Button } from '@/components/ui/Button';

/**
 * Login screen with phone number input
 */
export const LoginScreen = ({ onSubmit }) => {
  const [phone, setPhone] = useState('+7');
  const [isAgreed, setIsAgreed] = useState(false);

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = () => {
    if (isValidPhone(phone) && isAgreed) {
      onSubmit(phone);
    }
  };

  const isValid = isValidPhone(phone) && isAgreed;

  return (
    <div className="fixed inset-0 bg-white p-8 flex flex-col justify-center z-[3000] animate-slide-in-bottom">
      <h2 className="text-[40px] font-black uppercase italic leading-none mb-8">
        Вход
      </h2>

      <div className="space-y-6">
        <div>
          <label className="ga-label text-[10px] text-gray-400 mb-2 block">ТЕЛЕФОН</label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full px-5 py-4 bg-gray-100 rounded-2xl ga-body-medium text-lg focus:outline-none focus:ring-2 focus:ring-brand-green/30"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer px-1">
          <div
            onClick={() => setIsAgreed(!isAgreed)}
            className={`
              mt-0.5 shrink-0 w-6 h-6 rounded-lg border-2
              flex items-center justify-center transition-all
              ${isAgreed
                ? 'bg-brand-green border-brand-green'
                : 'border-gray-300'
              }
            `}
          >
            {isAgreed && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="ga-body text-sm text-gray-500 leading-snug">
            Я согласен с правилами Robin Food
          </span>
        </label>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isValid}
        fullWidth
        size="lg"
        className="mt-10"
      >
        Отправить код
      </Button>
    </div>
  );
};
