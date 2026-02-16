import React from 'react';
import { Search, X } from 'lucide-react';

/**
 * DS v3 Text Input
 * H=48px, radius.s (8px), semantic colors
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
        <label className="ds-body-s font-medium text-base-text-secondary px-1">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full h-12 px-4 rounded-ds-s
          bg-base-surface border-2 border-transparent
          ds-body-l text-base-text-primary placeholder-base-text-tertiary
          outline-none transition-all duration-200
          focus:border-semantic-cta-primary focus:bg-white
          ${error ? 'border-semantic-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="ds-body-s text-semantic-error px-1">{error}</p>
      )}
    </div>
  );
};

/**
 * DS v3 Search Input
 * H=44px per DS v3 SearchBar spec
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
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-text-tertiary"
        size={20}
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="
          w-full h-11 pl-11 pr-10 rounded-ds-s
          bg-base-surface border border-base-divider
          ds-body-m text-base-text-primary placeholder-base-text-tertiary
          outline-none transition-all duration-200
          focus:border-semantic-cta-primary focus:bg-white
        "
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-base-text-tertiary hover:text-base-text-secondary hover:bg-base-divider"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

/**
 * DS v3 SMS Code Input
 */
export const SmsInput = ({ values, onChange }) => {
  const handleChange = (value, index) => {
    const char = value.replace(/\D/g, '').slice(-1);
    const newValues = [...values];
    newValues[index] = char;
    onChange(newValues, index);

    if (char && index < 3) {
      document.getElementById(`sms-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !values[index] && index > 0) {
      document.getElementById(`sms-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="flex gap-3">
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
          className="w-14 h-16 bg-base-surface border-2 border-transparent rounded-ds-m text-2xl font-bold text-center outline-none transition-all focus:border-semantic-cta-primary focus:bg-white"
        />
      ))}
    </div>
  );
};

/**
 * DS v3 Checkbox
 */
export const Checkbox = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`flex gap-3 items-start cursor-pointer ${className}`}>
      <div
        onClick={() => onChange(!checked)}
        className={`
          mt-0.5 shrink-0 w-6 h-6 rounded-ds-xs border-2
          flex items-center justify-center transition-all duration-200
          ${checked
            ? 'bg-semantic-cta-primary border-semantic-cta-primary'
            : 'border-base-text-tertiary hover:border-base-text-secondary'
          }
        `}
      >
        {checked && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {label && (
        <span className="ds-body-m text-base-text-secondary leading-snug">{label}</span>
      )}
    </label>
  );
};

/**
 * DS v3 Toggle/Switch
 */
export const Toggle = ({ checked, onChange, label, className = '' }) => {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${className}`}>
      {label && (
        <span className="ds-body-l font-medium text-base-text-primary">{label}</span>
      )}
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative w-12 h-7 rounded-full transition-all duration-200
          ${checked ? 'bg-semantic-cta-primary' : 'bg-base-text-tertiary'}
        `}
      >
        <div
          className={`
            absolute top-1 w-5 h-5 bg-white rounded-full shadow-sm
            transition-all duration-200
            ${checked ? 'left-6' : 'left-1'}
          `}
        />
      </button>
    </label>
  );
};
