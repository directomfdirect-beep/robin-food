import React, { useState, useEffect, useCallback } from 'react';
import { X, Smartphone, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * SBPPaymentSheet — QR code + deep link for SBP payment
 */
export const SBPPaymentSheet = ({ amount, onSuccess, onCancel, onClose }) => {
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [status, setStatus] = useState('waiting');

  useEffect(() => {
    if (status !== 'waiting') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [status]);

  // Simulate WS confirmation
  useEffect(() => {
    if (status !== 'waiting') return;
    const t = setTimeout(() => {
      setStatus('confirmed');
      setTimeout(() => onSuccess?.(), 1500);
    }, 5000);
    return () => clearTimeout(t);
  }, [status, onSuccess]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-[50px] animate-sheet-up">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>
        <button onClick={onClose} className="absolute top-5 right-5 p-2 bg-gray-100 rounded-full">
          <X size={18} className="text-gray-500" />
        </button>

        <div className="px-6 pb-10 pt-4 text-center">
          {status === 'waiting' && (
            <>
              <div className="w-16 h-16 bg-brand-green/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Smartphone size={32} className="text-brand-green" />
              </div>
              <h2 className="font-black italic uppercase text-xl mb-2">Оплата через СБП</h2>
              <p className="text-sm text-gray-500 mb-6">
                Отсканируйте QR-код или нажмите кнопку для оплаты
              </p>

              {/* Mock QR code */}
              <div className="w-48 h-48 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                <div className="grid grid-cols-6 gap-1 p-4">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-sm ${Math.random() > 0.4 ? 'bg-black' : 'bg-white'}`}
                    />
                  ))}
                </div>
              </div>

              <p className="font-bold text-2xl text-brand-green mb-2">₽{amount}</p>

              <div className="flex items-center justify-center gap-2 text-gray-400 mb-6">
                <Clock size={14} />
                <span className="text-sm font-bold">
                  {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                </span>
              </div>

              <Button onClick={() => {}} fullWidth size="lg" className="mb-3">
                Открыть приложение банка
              </Button>
              <button
                onClick={onCancel}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Отменить
              </button>
            </>
          )}

          {status === 'confirmed' && (
            <>
              <div className="w-16 h-16 bg-brand-green/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-brand-green" />
              </div>
              <h2 className="font-black italic uppercase text-xl mb-2">Оплата прошла!</h2>
              <p className="text-sm text-gray-500">Переходим к отслеживанию заказа...</p>
            </>
          )}

          {status === 'expired' && (
            <>
              <div className="w-16 h-16 bg-error/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <Clock size={32} className="text-error" />
              </div>
              <h2 className="font-black italic uppercase text-xl mb-2">Время истекло</h2>
              <p className="text-sm text-gray-500 mb-6">Попробуйте оплатить снова</p>
              <Button onClick={onCancel} fullWidth size="lg">
                Вернуться в корзину
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
