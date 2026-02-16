import React from 'react';
import { XCircle, RefreshCw, MessageSquare } from 'lucide-react';

const OPTIONS = [
  {
    value: 'cancelItem',
    icon: XCircle,
    label: 'Убрать из заказа, если нет в наличии',
  },
  {
    value: 'replaceFullPrice',
    icon: RefreshCw,
    label: 'Заменить на аналог без скидки',
  },
  {
    value: 'allowPickerSuggestions',
    icon: MessageSquare,
    label: 'Разрешить пикеру предложить замену',
  },
];

/**
 * DS v3 Replacement Policy Selector
 * Radio group, 3 options per DS v3 section 3.10
 */
export const ReplacementPolicySelector = ({
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="ds-heading-s text-base-text-primary">Политика замены</h4>
      {OPTIONS.map((option) => {
        const isSelected = value === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              w-full h-14 px-4 rounded-ds-m flex items-center gap-3
              transition-all duration-200 text-left
              ${isSelected
                ? 'bg-semantic-cta-primary/[0.08] border-[1.5px] border-semantic-cta-primary'
                : 'bg-base-surface border border-base-divider hover:bg-base-divider'
              }
            `}
          >
            <Icon
              size={20}
              className={isSelected ? 'text-semantic-cta-primary' : 'text-base-text-secondary'}
            />
            <span className={`ds-body-m flex-1 ${isSelected ? 'text-base-text-primary font-medium' : 'text-base-text-secondary'}`}>
              {option.label}
            </span>
            {/* Radio dot */}
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              isSelected ? 'border-semantic-cta-primary' : 'border-base-text-tertiary'
            }`}>
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-semantic-cta-primary" />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};
