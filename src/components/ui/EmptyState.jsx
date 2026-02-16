import React from 'react';
import { Button } from './Button';

/**
 * DS v3 Empty State
 * Illustration + title + description + CTA, centered
 */
export const EmptyState = ({
  icon: Icon,
  title,
  description,
  ctaText,
  onCtaClick,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center py-ds-5xl px-ds-l ${className}`}>
      {Icon && (
        <div className="w-16 h-16 rounded-full bg-base-surface flex items-center justify-center mb-ds-l">
          <Icon size={32} className="text-base-text-tertiary" />
        </div>
      )}
      <h3 className="ds-heading-l text-base-text-primary mb-ds-xs">{title}</h3>
      {description && (
        <p className="ds-body-m text-base-text-secondary max-w-[280px] mb-ds-2xl">{description}</p>
      )}
      {ctaText && onCtaClick && (
        <Button variant="primary" size="m" onClick={onCtaClick}>
          {ctaText}
        </Button>
      )}
    </div>
  );
};
