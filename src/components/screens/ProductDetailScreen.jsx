import React, { useState, useCallback } from 'react';
import { ArrowLeft, Star, Minus, Plus, Store, Clock, MapPin, ShoppingBag, Check, Heart } from 'lucide-react';
import { calculatePrices } from '@/utils/price';
import { Button } from '@/components/ui/Button';

const formatExpiryDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  const months = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

const getHoursUntilExpiry = (date) => {
  if (!date) return null;
  const now = new Date();
  const expiry = new Date(date);
  return Math.max(0, Math.floor((expiry - now) / (1000 * 60 * 60)));
};

/**
 * ProductDetailScreen — full-screen product view (replaces ProductModal)
 */
export const ProductDetailScreen = ({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onBack,
  onViewStore,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const priceInfo = calculatePrices(product, quantity);
  const maxQuantity = product.maxQuantity || 10;
  const hoursLeft = getHoursUntilExpiry(product.expiryDate);
  const formattedExpiry = formatExpiryDate(product.expiryDate);

  const handleAddToCart = useCallback(async () => {
    if (isAdding || isAdded) return;
    setIsAdding(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onAddToCart(product, quantity);
    setIsAdding(false);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }, [isAdding, isAdded, product, quantity, onAddToCart]);

  if (!product) return null;

  return (
    <div className="min-h-screen bg-white animate-fade-in pb-32">
      {/* Image header */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-80 object-cover"
        />

        <button
          onClick={onBack}
          className="absolute top-6 left-4 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          onClick={() => onToggleFavorite?.(product.id)}
          className="absolute top-6 right-4 z-20 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
        >
          <Heart
            size={20}
            className={isFavorite ? 'text-error fill-error' : 'text-gray-400'}
          />
        </button>

        <div className="absolute top-6 left-20 bg-black text-acid px-4 py-2 rounded-2xl ga-button text-sm shadow-xl">
          -{priceInfo.discountPercent}%
        </div>

        {hoursLeft !== null && hoursLeft < 48 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-error/90 text-white px-4 py-2 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-lg">
            <Clock size={12} />
            Осталось {hoursLeft} ч
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 pt-6">
        {/* Title + price */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <div className="flex-1">
            <h1 className="font-black italic uppercase text-2xl leading-tight mb-2">
              {product.title}
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-orange-500">
                <Star size={16} fill="currentColor" stroke="none" />
                <span className="font-bold text-sm">{product.rating}</span>
              </div>
              {product.reviewsCount && (
                <span className="text-xs text-gray-400">{product.reviewsCount} отзывов</span>
              )}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <span className="line-through text-sm text-gray-400 block">
              ₽{(product.basePrice * quantity).toFixed(0)}
            </span>
            <span className="font-bold text-3xl text-brand-green">
              ₽{priceInfo.totalPrice}
            </span>
          </div>
        </div>

        {/* Expiry */}
        {formattedExpiry && (
          <div className="flex items-center gap-2 mb-3 text-gray-500">
            <Clock size={14} />
            <span className="text-sm">
              Годен до: <span className="font-bold text-black">{formattedExpiry}</span>
            </span>
          </div>
        )}

        {/* Store info */}
        {product.storeName && (
          <button
            onClick={() => onViewStore?.(product.storeId)}
            className="flex items-center gap-2 mb-6 text-gray-500 hover:text-brand-green transition-colors"
          >
            <MapPin size={14} />
            <span className="text-sm">
              {product.storeName} — {product.storeAddress}
            </span>
          </button>
        )}

        {/* Description */}
        {product.description && (
          <div className="mb-6">
            <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-2">Описание</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Bulk discount */}
        <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-bold uppercase text-gray-400">
              Выгода от количества
            </span>
            <span className="text-xs font-bold bg-black text-acid px-3 py-1 rounded-xl">
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
            <span className="text-[10px] text-gray-400">1 шт</span>
            <span className="text-[10px] text-gray-400">{maxQuantity} шт</span>
          </div>
        </div>

        {/* Quantity + add to cart */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => quantity > 1 && setQuantity((q) => q - 1)}
              disabled={quantity <= 1}
              className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30 transition-all"
            >
              <Minus size={20} />
            </button>
            <span className="font-bold text-xl w-12 text-center">{quantity}</span>
            <button
              onClick={() => quantity < maxQuantity && setQuantity((q) => q + 1)}
              disabled={quantity >= maxQuantity}
              className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30 transition-all"
            >
              <Plus size={20} />
            </button>
          </div>

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
            ) : isAdding ? (
              ''
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingBag size={20} /> В корзину
              </span>
            )}
          </Button>
        </div>

        <p className="text-center text-sm text-gray-400 mb-8">
          Всего: <span className="font-bold text-black">₽{priceInfo.totalPrice}</span> ({quantity} шт)
        </p>

        {/* Characteristics */}
        {product.characteristics && (
          <div>
            <h3 className="text-[10px] font-bold uppercase text-gray-400 mb-3">Характеристики</h3>
            <div className="space-y-2">
              {Object.entries(product.characteristics).map(([key, value]) => (
                <div key={key} className="flex justify-between p-4 bg-gray-50 rounded-2xl">
                  <span className="text-sm text-gray-500">{key}</span>
                  <span className="text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
