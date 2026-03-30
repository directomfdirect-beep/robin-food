import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * Text Input — editorial style with acid focus ring
 */
export const Input = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  label,
  error,
  className = '',
  ...props
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="ga-label text-[10px] text-gray-500 px-1 block">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full h-12 px-4 rounded-2xl
          bg-gray-100 border-2 border-transparent
          ga-body text-black placeholder-gray-400
          outline-none transition-all duration-200
          focus:border-acid focus:bg-white
          ${error ? 'border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="ga-body text-[11px] text-error px-1">{error}</p>
      )}
    </div>
  );
};

/**
 * Search Input — black bg editorial
 */
export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Найти продукт…',
  className = '',
}) => {
  return (
    <div className={`relative ${className}`}>
      <Search
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
        strokeWidth={2}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full h-11 pl-10 pr-10 rounded-2xl
          bg-gray-100 border-2 border-transparent
          ga-body text-black placeholder-gray-400
          outline-none transition-all duration-200
          focus:border-acid focus:bg-white
        "
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-black"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

/**
 * SMS Code Input — 6 digit OTP
 */
export const SmsInput = ({ values, onChange }) => {
  const handleChange = (value, index) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newValues = [...values];
    newValues[index] = char;
    onChange(newValues, index);

    if (char && index < values.length - 1) {
      document.getElementById(`sms-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      document.getElementById(`sms-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="flex gap-2">
      {values.map((val, i) => (
        <input
          key={i}
          id={`sms-${i}`}
          type="text"
          inputMode="numeric"
          value={val}
          maxLength={1}
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-12 h-14 bg-gray-100 border-2 border-transparent rounded-2xl ga-price text-[24px] text-center outline-none transition-all focus:border-acid focus:bg-white"
        />
      ))}
    </div>
  );
};

/**
 * Checkbox — acid checkmark
 */
export const Checkbox = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`flex gap-3 items-start cursor-pointer ${className}`}>
      <div
        onClick={() => onChange(!checked)}
        className={`
          mt-0.5 shrink-0 w-6 h-6 rounded-lg border-2
          flex items-center justify-center transition-all duration-200
          ${checked
            ? 'bg-black border-black'
            : 'border-gray-300 hover:border-gray-500'
          }
        `}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#BDFF00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label && (
        <span className="ga-body text-sm text-gray-600 leading-snug">{label}</span>
      )}
    </label>
  );
};

/**
 * Toggle/Switch — acid when active
 */
export const Toggle = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${className}`}>
      {label && (
        <span className="ga-body-medium text-sm text-black">{label}</span>
      )}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-7 rounded-full transition-all duration-200
          ${checked ? 'bg-black' : 'bg-gray-300'}
        `}
      >
        <div
          className={`
            absolute top-1 w-5 h-5 rounded-full shadow-sm
            transition-all duration-200
            ${checked ? 'left-6 bg-acid' : 'left-1 bg-white'}
          `}
        />
      </button>
    </label>
  );
};
