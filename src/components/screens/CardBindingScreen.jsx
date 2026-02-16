import React, { useState, useCallback, useMemo } from 'react';
import { CreditCard, ChevronLeft, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  luhnCheck,
  detectCardBrand,
  formatCardNumber,
  formatExpiry,
  validateExpiry,
  validateCVC,
  parseExpiry,
} from '@/utils/card';

/**
 * Card brand icons
 */
const CardBrandIcon = ({ brand }) => {
  if (!brand) return null;

  const icons = {
    visa: (
      <svg viewBox="0 0 48 32" className="w-10 h-6">
        <rect fill="#1A1F71" width="48" height="32" rx="4" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold" fontFamily="Arial">
          VISA
        </text>
      </svg>
    ),
    mastercard: (
      <svg viewBox="0 0 48 32" className="w-10 h-6">
        <rect fill="#000" width="48" height="32" rx="4" />
        <circle cx="18" cy="16" r="10" fill="#EB001B" />
        <circle cx="30" cy="16" r="10" fill="#F79E1B" />
        <path d="M24 8.5a10 10 0 0 0 0 15" fill="#FF5F00" />
      </svg>
    ),
    mir: (
      <svg viewBox="0 0 48 32" className="w-10 h-6">
        <rect fill="#4DB45E" width="48" height="32" rx="4" />
        <text x="24" y="20" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">
          МИР
        </text>
      </svg>
    ),
  };

  return icons[brand] || null;
};

/**
 * Input field component
 */
const CardInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  maxLength,
  type = 'text',
  inputMode = 'numeric',
  rightElement,
  className = '',
}) => (
  <div className={className}>
    <label className="ga-label text-[10px] text-gray-500 block mb-2">{label}</label>
    <div className="relative">
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`
          w-full px-4 py-4 rounded-2xl bg-white border-2 transition-all
          ga-body-medium text-base tracking-wider
          focus:outline-none focus:ring-0
          ${error
            ? 'border-error focus:border-error'
            : 'border-gray-100 focus:border-brand-green'
          }
        `}
      />
      {rightElement && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
    {error && (
      <p className="flex items-center gap-1 mt-2 text-error text-xs ga-body">
        <AlertCircle size={12} /> {error}
      </p>
    )}
  </div>
);

/**
 * Card Binding Screen
 */
export const CardBindingScreen = ({ onBack, onSuccess, onSkip }) => {
  // Form state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [showSkipDialog, setShowSkipDialog] = useState(false);

  // Derived values
  const cardDigits = cardNumber.replace(/\D/g, '');
  const cardBrand = useMemo(() => detectCardBrand(cardDigits), [cardDigits]);
  
  // Validation
  const validation = useMemo(() => {
    const errors = {};
    
    // Card number
    if (cardDigits.length === 16) {
      if (!luhnCheck(cardDigits)) {
        errors.cardNumber = 'Номер карты неверный';
      }
    } else if (cardDigits.length > 0 && cardDigits.length < 16) {
      errors.cardNumber = null; // Still typing
    }
    
    // Expiry
    if (expiry.length >= 7) {
      if (!validateExpiry(expiry)) {
        const parsed = parseExpiry(expiry);
        if (parsed && (parsed.month < 1 || parsed.month > 12)) {
          errors.expiry = 'Неверный месяц';
        } else {
          errors.expiry = 'Срок действия карты истёк';
        }
      }
    }
    
    // CVC
    if (cvc.length > 0 && cvc.length < 3) {
      errors.cvc = null; // Still typing
    }
    
    return errors;
  }, [cardDigits, expiry, cvc]);

  const isValid = useMemo(() => {
    return (
      cardDigits.length === 16 &&
      luhnCheck(cardDigits) &&
      validateExpiry(expiry) &&
      validateCVC(cvc)
    );
  }, [cardDigits, expiry, cvc]);

  // Handlers
  const handleCardNumberChange = useCallback((e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    setApiError(null);
  }, []);

  const handleExpiryChange = useCallback((e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    setApiError(null);
  }, []);

  const handleCvcChange = useCallback((e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCvc(digits);
    setApiError(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    setApiError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      // Mock success - in real app, call API here
      // const response = await fetch('/payment/bind-card', { ... });
      
      const parsed = parseExpiry(expiry);
      
      // Store card info (mock)
      const cardInfo = {
        last4: cardDigits.slice(-4),
        brand: cardBrand,
        expiryMonth: parsed.month,
        expiryYear: parsed.year,
      };
      
      console.log('Card bound:', cardInfo);
      onSuccess?.(cardInfo);
    } catch (error) {
      setApiError('Карта не может быть привязана. Попробуйте другую карту.');
    } finally {
      setIsLoading(false);
    }
  }, [isValid, isLoading, cardDigits, expiry, cardBrand, onSuccess]);

  const handleSkip = useCallback(() => {
    setShowSkipDialog(true);
  }, []);

  const confirmSkip = useCallback(() => {
    setShowSkipDialog(false);
    onSkip?.();
  }, [onSkip]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 shadow-sm">
        <button
          onClick={onBack}
          className="p-2 -ml-2 text-gray-400 hover:text-black transition-colors"
        >
          <ChevronLeft size={28} />
        </button>
        <h1 className="ga-title text-lg">Привязка карты</h1>
      </header>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Title */}
        <div className="text-center pt-4">
          <div className="w-16 h-16 bg-brand-green/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <CreditCard size={32} className="text-brand-green" />
          </div>
          <h2 className="ga-title text-xl">Добавьте способ оплаты</h2>
          <p className="ga-body text-sm text-gray-400 mt-2">
            Для оплаты заказов в приложении
          </p>
        </div>

        {/* Card preview */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-3xl shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-md" />
            {cardBrand ? (
              <CardBrandIcon brand={cardBrand} />
            ) : (
              <CreditCard size={28} className="opacity-30" />
            )}
          </div>
          <div className="ga-price text-xl tracking-[0.15em] mb-4 relative z-10">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>
          <div className="flex justify-between items-end relative z-10">
            <div>
              <p className="text-[10px] text-gray-400 uppercase">Срок</p>
              <p className="ga-body-medium text-sm">{expiry || 'MM / YY'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase">CVC</p>
              <p className="ga-body-medium text-sm">{cvc ? '•••' : '•••'}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <CardInput
            label="Номер карты"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="0000 0000 0000 0000"
            error={validation.cardNumber}
            maxLength={19}
            rightElement={<CardBrandIcon brand={cardBrand} />}
          />

          <div className="grid grid-cols-2 gap-4">
            <CardInput
              label="Срок действия"
              value={expiry}
              onChange={handleExpiryChange}
              placeholder="MM / YY"
              error={validation.expiry}
              maxLength={7}
            />
            <CardInput
              label="CVC"
              value={cvc}
              onChange={handleCvcChange}
              placeholder="•••"
              error={validation.cvc}
              maxLength={3}
              type="password"
            />
          </div>
        </div>

        {/* API Error */}
        {apiError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl">
            <AlertCircle size={20} className="text-error flex-shrink-0" />
            <p className="ga-body text-sm text-error">{apiError}</p>
          </div>
        )}

        {/* Save checkbox */}
        <label className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer">
          <div
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
              saveCard ? 'bg-brand-green' : 'bg-gray-200'
            }`}
          >
            {saveCard && <Check size={14} className="text-white" />}
          </div>
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="sr-only"
          />
          <span className="ga-body-medium text-sm text-gray-700">
            Сохранить карту для будущих платежей
          </span>
        </label>
      </div>

      {/* Footer */}
      <div className="p-6 bg-white border-t border-gray-100 space-y-4">
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          loading={isLoading}
          fullWidth
          size="lg"
        >
          {isLoading ? '' : 'Привязать карту'}
        </Button>

        <button
          onClick={handleSkip}
          className="w-full text-center py-3 ga-body-medium text-sm text-brand-green hover:text-brand-green/80 transition-colors"
        >
          Пропустить (без карты)
        </button>
      </div>

      {/* Skip confirmation dialog */}
      {showSkipDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-t-[40px] p-8 space-y-6 animate-slide-in-bottom">
            <h3 className="ga-title text-xl text-center">Пропустить?</h3>
            <p className="ga-body text-center text-gray-500">
              Вы сможете добавить карту позже в настройках профиля
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => setShowSkipDialog(false)}
                fullWidth
                size="md"
              >
                Добавить сейчас
              </Button>
              <button
                onClick={confirmSkip}
                className="w-full py-4 ga-body-medium text-sm text-gray-500 hover:text-black transition-colors"
              >
                Пропустить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
