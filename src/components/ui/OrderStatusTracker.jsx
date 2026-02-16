import React from 'react';
import { Check } from 'lucide-react';

const STEPS = [
  { key: 'created', label: 'Создан' },
  { key: 'paid', label: 'Оплачен' },
  { key: 'accepted', label: 'Принят' },
  { key: 'picking', label: 'Сборка' },
  { key: 'ready', label: 'Готов' },
  { key: 'completed', label: 'Завершён' },
];

/**
 * DS v3 Order Status Tracker
 * Horizontal stepper, 6 steps
 * Node: completed = green+check, current = green+pulse, future = divider
 */
export const OrderStatusTracker = ({
  currentStatus = 'created',
  cancelled = false,
  className = '',
}) => {
  const currentIndex = STEPS.findIndex(s => s.key === currentStatus);

  return (
    <div className={`w-full ${className}`}>
      {/* Steps row */}
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const isFuture = i > currentIndex;

          return (
            <React.Fragment key={step.key}>
              {/* Node */}
              <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center transition-all
                    ${isCompleted ? 'bg-semantic-success' : ''}
                    ${isCurrent && !cancelled ? 'bg-semantic-cta-primary animate-cta-pulse' : ''}
                    ${isCurrent && cancelled ? 'bg-semantic-error' : ''}
                    ${isFuture ? 'bg-base-divider' : ''}
                  `}
                >
                  {isCompleted && <Check size={14} className="text-white" strokeWidth={3} />}
                  {isCurrent && (
                    <div className={`w-2.5 h-2.5 rounded-full ${cancelled ? 'bg-white' : 'bg-white'}`} />
                  )}
                </div>
                <span className={`ds-body-xs text-center whitespace-nowrap ${
                  isCompleted || isCurrent ? 'text-base-text-primary font-medium' : 'text-base-text-tertiary'
                }`}>
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 mt-[-18px] ${
                    i < currentIndex ? 'bg-semantic-success' : 'bg-base-divider'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
