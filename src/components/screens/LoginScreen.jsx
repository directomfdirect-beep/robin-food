import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import robinCatalogBlackLogo from '/robin-catalog-black.png';
import { formatPhone, isValidPhone } from '@/utils/phone';
import { Button } from '@/components/ui/Button';
import { auth } from '@/lib/api';

/**
 * Login screen with phone number input
 * Sends OTP via backend API, falls back to mock on error
 */
export const LoginScreen = ({ onSubmit, onBack }) => {
  const [phone, setPhone] = useState('+7');
  const [isAgreed, setIsAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
    setError('');
  };

  const handleSubmit = async () => {
    if (!isValidPhone(phone) || !isAgreed) return;
    setLoading(true);
    setError('');
    try {
      const cleanPhone = phone.replace(/[\s()-]/g, '');
      await auth.sendOtp(cleanPhone);
      onSubmit(cleanPhone);
    } catch (err) {
      if (err.code === 'RATE_LIMITED') {
        setError('Подождите 60 секунд перед повторной отправкой');
      } else {
        console.warn('API unavailable, using mock OTP flow:', err.message);
        onSubmit(phone);
      }
    } finally {
      setLoading(false);
    }
  };

  const isValid = isValidPhone(phone) && isAgreed;

  return (
    <div className="fixed inset-0 bg-white p-8 flex flex-col justify-center z-[3000] animate-slide-in-bottom">
      {onBack && (
        <button
          onClick={onBack}
          className="self-start p-2 -ml-2 mb-6 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      )}
      <img src={robinCatalogBlackLogo} alt="Robin Food" className="h-10 object-contain mb-6" />
      <h2 className="ga-title text-[48px] leading-none mb-8">
        Вход
      </h2>

      <div className="space-y-6">
        <div>
          <label className="ga-label text-[10px] text-gray-400 mb-2 block">ТЕЛЕФОН</label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            className="w-full px-5 py-4 bg-gray-100 rounded-2xl ga-body-medium text-lg border-2 border-transparent focus:outline-none focus:border-acid"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer px-1">
          <div
            onClick={() => setIsAgreed(!isAgreed)}
            className={`
              mt-0.5 shrink-0 w-6 h-6 rounded-lg border-2
              flex items-center justify-center transition-all
              ${isAgreed
                ? 'bg-black border-black'
                : 'border-gray-300'
              }
            `}
          >
            {isAgreed && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BDFF00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
          <span className="ga-body text-sm text-gray-500 leading-snug">
            Я согласен с правилами Robin Food
          </span>
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-4">{error}</p>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        fullWidth
        size="lg"
        className="mt-10"
      >
        {loading ? 'Отправка...' : 'Отправить код'}
      </Button>
    </div>
  );
};
