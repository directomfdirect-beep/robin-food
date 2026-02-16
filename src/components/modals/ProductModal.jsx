import React, { useState, useCallback } from 'react';
import { X, Star, Minus, Plus, Store, Clock, MapPin, ShoppingBag, Check } from 'lucide-react';
import { calculatePrices } from '@/utils/price';
import { Button } from '@/components/ui/Button';

/**
 * Format expiry date to readable string
 */
const formatExpiryDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

/**
 * Calculate hours until expiry
 */
const getHoursUntilExpiry = (date) => {
  if (!date) return null;
  const now = new Date();
  const expiry = new Date(date);
  const diff = expiry - now;
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60)));
};

/**
 * Product detail modal with full information
 */
export const ProductModal = ({ product, onClose, onAddToCart, onViewReviews }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  
  const priceInfo = calculatePrices(product, quantity);
  const maxQuantity = product.maxQuantity || 10;
  const hoursLeft = getHoursUntilExpiry(product.expiryDate);
  const formattedExpiry = formatExpiryDate(product.expiryDate);

  if (!product) return null;

  const handleAddToCart = useCallback(async () => {
    if (isAdding || isAdded) return;
    
    setIsAdding(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    onAddToCart(product, quantity);
    setIsAdding(false);
    setIsAdded(true);
    
    // Reset and close after a moment
    setTimeout(() => {
      onClose();
    }, 1000);
  }, [isAdding, isAdded, product, quantity, onAddToCart, onClose]);

  const handleIncrement = useCallback(() => {
    if (quantity < maxQuantity) {
      setQuantity(q => q + 1);
    }
  }, [quantity, maxQuantity]);

  const handleDecrement = useCallback(() => {
    if (quantity > 1) {
      setQuantity(q => q - 1);
    }
  }, [quantity]);

  // Truncate description if too long
  const description = product.description || '';
  const shouldTruncate = description.length > 120;
  const displayDescription = showFullDescription || !shouldTruncate
    ? description
    : description.slice(0, 120) + '...';

  return (
    <div className="fixed inset-0 z-[8000] flex items-end justify-center animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal content */}
      <div className="relative w-full max-h-[94%] bg-white rounded-t-[50px] shadow-2xl overflow-y-auto no-scrollbar animate-slide-in-bottom">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-8 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <X size={24} />
        </button>

        {/* Image with discount badge */}
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-80 object-cover rounded-t-[50px]"
          />
          
          {/* Discount badge */}
          <div className="absolute top-6 left-8 bg-black text-acid px-4 py-2 rounded-2xl ga-button text-sm shadow-xl">
            -{priceInfo.discountPercent}%
          </div>

          {/* Expiry urgency indicator */}
          {hoursLeft !== null && hoursLeft < 48 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-error/90 backdrop-blur-sm text-white px-4 py-2 rounded-full ga-label text-[10px] flex items-center gap-2 shadow-lg">
              <Clock size={12} />
              Осталось {hoursLeft} ч
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 pb-16 pt-6 text-black">
          {/* Title and Price */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <div className="flex-1">
              <h2 className="ga-title text-2xl leading-tight mb-2">
                {product.title}
              </h2>
              {/* Rating and reviews */}
              <button 
                onClick={onViewReviews}
                className="flex items-center gap-3 hover:opacity-70 transition-opacity"
              >
                <div className="flex items-center gap-1 text-orange-500">
                  <Star size={16} fill="currentColor" stroke="none" />
                  <span className="ga-price text-sm">{product.rating}</span>
                </div>
                {product.reviewsCount && (
                  <span className="ga-body text-xs text-brand-green underline">
                    {product.reviewsCount} отзывов →
                  </span>
                )}
              </button>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="ga-price-old text-sm text-gray-400 block">
                ₽{(product.basePrice * quantity).toFixed(0)}
              </span>
              <span className="ga-price text-4xl text-brand-green">
                ₽{priceInfo.totalPrice}
              </span>
            </div>
          </div>

          {/* Expiry date */}
          {formattedExpiry && (
            <div className="flex items-center gap-2 mb-3 text-gray-500">
              <Clock size={14} />
              <span className="ga-body text-sm">
                Годен до: <span className="ga-body-medium text-black">{formattedExpiry}</span>
              </span>
            </div>
          )}

          {/* Store info */}
          <div className="flex items-center gap-2 mb-6 text-gray-500">
            <MapPin size={14} />
            <span className="ga-body text-sm">
              {product.storeName} — {product.storeAddress}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="ga-label text-[10px] text-gray-400 mb-2">Описание</h3>
            <p className="ga-body text-sm text-gray-600 leading-relaxed">
              {displayDescription}
            </p>
            {shouldTruncate && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="ga-body-medium text-sm text-brand-green mt-2 hover:underline"
              >
                {showFullDescription ? 'Скрыть' : 'Показать полностью'}
              </button>
            )}
          </div>

          {/* Bulk discount indicator */}
          <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 mb-6">
            <div className="flex justify-between items-center mb-3">
              <span className="ga-label text-[10px] text-gray-400">Выгода от количества</span>
              <span className="ga-button text-xs bg-black text-acid px-3 py-1 rounded-xl">
                ОПТ: -{priceInfo.bulkBonusPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-green to-emerald-400 transition-all duration-500"
                style={{ width: `${Math.min((quantity / maxQuantity) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2">
              <span className="ga-body text-[10px] text-gray-400">1 шт</span>
              <span className="ga-body text-[10px] text-gray-400">{maxQuantity} шт</span>
            </div>
          </div>

          {/* Quantity and add to cart */}
          <div className="flex items-center gap-4 mb-4">
            {/* Quantity selector */}
            <div className="flex items-center bg-gray-100 rounded-2xl p-1">
              <button
                onClick={handleDecrement}
                disabled={quantity <= 1}
                className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30 disabled:shadow-none transition-all hover:bg-gray-50"
              >
                <Minus size={20} />
              </button>
              <span className="ga-price text-xl w-12 text-center">{quantity}</span>
              <button
                onClick={handleIncrement}
                disabled={quantity >= maxQuantity}
                className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30 disabled:shadow-none transition-all hover:bg-gray-50"
              >
                <Plus size={20} />
              </button>
            </div>

            {/* Add to cart button */}
            <Button
              onClick={handleAddToCart}
              loading={isAdding}
              disabled={isAdded}
              variant={isAdded ? 'accent' : 'primary'}
              size="lg"
              className="flex-1"
            >
              {isAdded ? (
                <span className="flex items-center gap-2">
                  <Check size={20} /> Добавлено
                </span>
              ) : isAdding ? '' : (
                <span className="flex items-center gap-2">
                  <ShoppingBag size={20} /> В корзину
                </span>
              )}
            </Button>
          </div>

          {/* Total price text */}
          <p className="text-center ga-body text-sm text-gray-400 mb-8">
            Всего: <span className="ga-body-medium text-black">₽{priceInfo.totalPrice}</span> ({quantity} шт)
          </p>

          {/* Characteristics */}
          <div>
            <h3 className="ga-label text-[10px] text-gray-400 mb-3">Характеристики</h3>
            <div className="space-y-2">
              {Object.entries(product.characteristics || {}).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between p-4 bg-gray-50 rounded-2xl"
                >
                  <span className="ga-body text-sm text-gray-500">{key}</span>
                  <span className="ga-body-medium text-sm text-black">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
