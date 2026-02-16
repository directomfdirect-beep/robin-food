import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';

/**
 * SMS code verification screen
 */
export const SmsScreen = ({ phone, onVerify }) => {
  const [smsCode, setSmsCode] = useState(['', '', '', '']);
  const inputsRef = useRef([]);

  const handleChange = (value, index) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newValues = [...smsCode];
    newValues[index] = char;
    setSmsCode(newValues);

    if (char && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !smsCode[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const isComplete = smsCode.every((digit) => digit !== '');

  return (
    <div className="fixed inset-0 bg-white p-8 flex flex-col justify-center items-center text-center z-[3100] animate-slide-in-right">
      <h2 className="text-[32px] font-black uppercase italic leading-none mb-3">
        Код из СМС
      </h2>
      <p className="ga-body text-sm text-gray-400 mb-10">
        Отправлено на {phone}
      </p>

      <div className="flex gap-3 mb-10">
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
            className="w-14 h-16 bg-gray-100 border-2 border-transparent rounded-2xl text-2xl font-bold text-center focus:outline-none focus:border-brand-green transition-colors"
          />
        ))}
      </div>

      <Button
        onClick={onVerify}
        disabled={!isComplete}
        fullWidth
        size="lg"
      >
        Подтвердить
      </Button>
    </div>
  );
};
