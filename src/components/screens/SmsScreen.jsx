import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { auth } from '@/lib/api';

const RESEND_COOLDOWN = 60;

/**
 * SMS code verification screen (6-digit OTP) with countdown + resend button
 * Verifies via backend API, falls back to mock on error
 */
export const SmsScreen = ({ phone, onVerify, onBack }) => {
  const [smsCode, setSmsCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef([]);
  const timerRef = useRef(null);

  // Start countdown on mount
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const handleResend = useCallback(async () => {
    if (countdown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      const cleanPhone = phone.replace(/[\s()-]/g, '');
      await auth.sendOtp(cleanPhone);
    } catch {
      // ignore — mock flow
    } finally {
      setResending(false);
      setCountdown(RESEND_COOLDOWN);
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) { clearInterval(timerRef.current); return 0; }
          return c - 1;
        });
      }, 1000);
    }
  }, [countdown, resending, phone]);

  const handleChange = (value, index) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newValues = [...smsCode];
    newValues[index] = char;
    setSmsCode(newValues);
    setError('');

    if (char && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !smsCode[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newValues = [...smsCode];
      for (let i = 0; i < pasted.length; i++) {
        newValues[i] = pasted[i];
      }
      setSmsCode(newValues);
      const nextIndex = Math.min(pasted.length, 5);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = smsCode.join('');
    if (code.length !== 6) return;

    setLoading(true);
    setError('');
    try {
      const data = await auth.verifyOtp(phone, code);
      onVerify(data.user || {});
    } catch (err) {
      if (err.status === 400) {
        setError(err.message || 'Неверный код');
      } else {
        console.warn('API unavailable, using mock verify:', err.message);
        onVerify({});
      }
    } finally {
      setLoading(false);
    }
  };

  const isComplete = smsCode.every((digit) => digit !== '');

  return (
    <div className="fixed inset-0 bg-white p-8 flex flex-col z-[3100] animate-slide-in-right">
      {/* Back button */}
      {onBack && (
        <button
          onClick={onBack}
          className="self-start p-2 -ml-2 mb-6 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      <div className="flex-1 flex flex-col justify-center items-center text-center">
        <h2 className="ga-title text-[38px] leading-none mb-3">
          Код из СМС
        </h2>
        <p className="ga-body text-sm text-gray-400 mb-10">
          Отправлено на {phone}
        </p>

        <div className="flex gap-3 mb-4">
          {smsCode.map((val, i) => (
            <input
              key={i}
              ref={(el) => (inputsRef.current[i] = el)}
              type="text"
              inputMode="numeric"
              value={val}
              maxLength={1}
              onChange={(e) => handleChange(e.target.value, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-12 h-14 bg-gray-100 border-2 border-transparent rounded-2xl text-xl font-bold text-center focus:outline-none focus:border-acid transition-colors"
            />
          ))}
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}
        {!error && <div className="mb-4" style={{ height: '20px' }} />}

        <Button
          onClick={handleVerify}
          disabled={!isComplete || loading}
          fullWidth
          size="lg"
        >
          {loading ? 'Проверка...' : 'Подтвердить'}
        </Button>

        {/* Resend section */}
        <div className="mt-6">
          {countdown > 0 ? (
            <p className="text-sm text-gray-400">
              Выслать повторно через{' '}
              <span className="font-bold text-black">{countdown} с</span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              className="text-sm font-bold text-black underline disabled:opacity-50"
            >
              {resending ? 'Отправка...' : 'Выслать код повторно'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
