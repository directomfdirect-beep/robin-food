import React from 'react';
import { Heart } from 'lucide-react';
import { AddButton } from './Button';
import { DiscountBadge, FreshnessBadge } from './Badge';

/**
 * DS v3 Base Card
 * bg base.card, elevation.1, radius.m (12px)
 */
export const Card = ({
  children,
  padding = 'md',
  elevated = false,
  className = '',
  onClick,
  ...props
}) => {
  const paddings = {
    none: '',
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  return (
    <div
      onClick={onClick}
      className={`
        bg-base-card rounded-ds-m
        ${elevated ? 'shadow-elevation-2' : 'shadow-elevation-1'}
        ${paddings[padding]}
        ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * DS v3 Product Card — compact variant (grid, 2 columns)
 * 4:3 photo, freshness + discount badges, semantic pricing
 */
export const ProductCard = ({
  product,
  onAddToCart,
  onFavoriteToggle,
  onClick,
  isFavorite = false,
  cartQuantity = 0,
  onIncrement,
  onDecrement,
  className = '',
}) => {
  const {
    title,
    image,
    currentPrice,
    originalPrice,
    discount,
    storeName,
    distance,
    expiryDate,
    freshnessScore,
  } = product;

  const handleAddClick = (e) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onFavoriteToggle?.(product.id);
  };

  // Determine border-left based on freshness
  const borderLeft = freshnessScore === 'urgent'
    ? 'border-l-4 border-l-semantic-urgent'
    : freshnessScore === 'lastday'
      ? 'border-l-2 border-l-semantic-lastday'
      : '';

  // Background tint for urgent items
  const bgTint = freshnessScore === 'urgent'
    ? 'bg-orange-50/60'
    : freshnessScore === 'lastday'
      ? 'bg-amber-50/30'
      : 'bg-base-card';

  return (
    <div
      onClick={() => onClick?.(product)}
      className={`
        ${bgTint} rounded-ds-m shadow-elevation-1 overflow-hidden
        cursor-pointer transition-all duration-200
        hover:shadow-elevation-2 active:scale-[0.98]
        ${borderLeft}
        ${className}
      `}
    >
      {/* Photo — 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] bg-base-surface overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        {/* Freshness badge — bottom-left */}
        {freshnessScore && (
          <div className="absolute bottom-2 left-2">
            <FreshnessBadge score={freshnessScore} />
          </div>
        )}

        {/* Discount badge — bottom-right */}
        {discount && (
          <div className="absolute bottom-2 right-2">
            <DiscountBadge percent={discount} />
          </div>
        )}

        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm"
        >
          <Heart
            size={16}
            className={isFavorite ? 'fill-semantic-error text-semantic-error' : 'text-base-text-tertiary'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-ds-s">
        {/* Title — max 2 lines */}
        <h3 className="ds-heading-s text-base-text-primary line-clamp-2 mb-0.5">
          {title}
        </h3>

        {/* Store + distance */}
        {(storeName || distance) && (
          <p className="ds-body-s text-base-text-secondary truncate mb-1">
            {storeName}{distance ? ` · ${distance}` : ''}
          </p>
        )}

        {/* Price row */}
        <div className="flex items-baseline gap-1.5 mb-1">
          {originalPrice && originalPrice !== currentPrice && (
            <span className="ds-label-price-old">{originalPrice} ₽</span>
          )}
          <span className="ds-label-price text-base-text-primary">{currentPrice} ₽</span>
        </div>

        {/* Expiry date */}
        {expiryDate && (
          <p className="ds-body-xs text-base-text-tertiary mb-2">
            Годен до: {expiryDate}
          </p>
        )}

        {/* CTA */}
        {cartQuantity > 0 ? (
          <QuantityStepperInline
            quantity={cartQuantity}
            onIncrement={(e) => { e.stopPropagation(); onIncrement?.(product); }}
            onDecrement={(e) => { e.stopPropagation(); onDecrement?.(product); }}
          />
        ) : (
          <button
            onClick={handleAddClick}
            className="w-full h-9 rounded-ds-s bg-semantic-cta-primary text-white ds-label-button-s flex items-center justify-center gap-1 hover:brightness-95 transition-all"
          >
            + Корзина
          </button>
        )}
      </div>
    </div>
  );
};

/** Inline quantity stepper for product card */
const QuantityStepperInline = ({ quantity, onIncrement, onDecrement }) => (
  <div className="flex items-center justify-between h-9 rounded-ds-s bg-base-surface border border-base-divider">
    <button onClick={onDecrement} className="w-9 h-full flex items-center justify-center text-base-text-secondary hover:text-semantic-error transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
    </button>
    <span className="ds-label-button-s text-base-text-primary">{quantity}</span>
    <button onClick={onIncrement} className="w-9 h-full flex items-center justify-center text-semantic-cta-primary hover:brightness-90 transition-colors">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
    </button>
  </div>
);

/**
 * DS v3 Store Card
 * Full-width, ~88px height, radius.m, elevation.1
 */
export const StoreCard = ({
  store,
  onClick,
  className = '',
}) => {
  const { name, address, logo, distance, openHours, productCount, minOrder, isOpen = true } = store;

  return (
    <div
      onClick={() => onClick?.(store)}
      className={`
        bg-base-card rounded-ds-m shadow-elevation-1 p-ds-m
        cursor-pointer transition-all duration-200
        hover:shadow-elevation-2 active:scale-[0.98]
        ${!isOpen ? 'opacity-60' : ''}
        ${className}
      `}
    >
      <div className="flex gap-3 items-center">
        {/* Logo */}
        <div className="w-10 h-10 bg-base-surface rounded-ds-s flex items-center justify-center overflow-hidden flex-shrink-0">
          {logo ? (
            <img src={logo} alt={name} className="w-7 h-7 object-contain" />
          ) : (
            <div className="w-7 h-7 bg-base-divider rounded-ds-xs" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="ds-heading-m text-base-text-primary truncate">{name}</h3>
          <p className="ds-body-m text-base-text-secondary truncate">
            {address}{distance ? ` · ${distance}` : ''}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            {isOpen && openHours && (
              <span className="ds-body-s text-semantic-fresh">Открыт до {openHours}</span>
            )}
            {!isOpen && (
              <span className="ds-body-s text-semantic-error">Закрыт</span>
            )}
            {productCount && (
              <span className="ds-body-s text-base-text-secondary">{productCount} товаров</span>
            )}
          </div>
          {minOrder && (
            <p className="ds-body-xs text-base-text-tertiary mt-0.5">Мин. заказ: {minOrder} ₽</p>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * DS v3 Banner Hero
 * Vibrant gradient, display.hero title
 */
export const PromoBanner = ({
  title,
  subtitle,
  ctaText,
  onClick,
  className = '',
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-gradient-to-r from-vibrant-gradient-start to-vibrant-gradient-end
        rounded-ds-xl p-ds-l
        text-white cursor-pointer transition-all duration-200
        hover:shadow-elevation-2 active:scale-[0.99]
        ${className}
      `}
    >
      <h2 className="ds-display-hero text-white mb-1">{title}</h2>
      {subtitle && <p className="ds-body-l text-white/90 mb-3">{subtitle}</p>}
      {ctaText && (
        <button className="h-10 px-5 rounded-ds-s bg-white/20 backdrop-blur text-white ds-label-button-s hover:bg-white/30 transition-colors">
          {ctaText}
        </button>
      )}
    </div>
  );
};
