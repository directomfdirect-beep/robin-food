import { motion } from 'framer-motion';
import { Heart, Plus, Minus, Clock } from 'lucide-react';
import { calculatePrices } from '@/utils/price';
import { useCountdown } from '@/hooks/useCountdown';

/**
 * Product card — editorial black/acid style with spring animations
 */
export const ProductCard = ({
  product,
  isFavorite,
  onFavoriteToggle,
  onClick,
  onAddToCart,
  cartItem,
  onIncrement,
  onDecrement,
}) => {
  const priceInfo = calculatePrices(product, 1);
  const inCart = cartItem && cartItem.qty > 0;
  const countdown = useCountdown(product.discountExpiresAt);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onFavoriteToggle(product.id);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (onAddToCart) onAddToCart(product, 1);
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (onIncrement) onIncrement(product.id, product.storeId);
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (onDecrement) onDecrement(product.id, product.storeId);
  };

  return (
    <motion.div
      onClick={() => onClick(product)}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="flex flex-col gap-2 cursor-pointer"
    >
      {/* Image container */}
      <div className="aspect-[3/4] rounded-[28px] overflow-hidden bg-gray-50 relative">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-contain"
          loading="lazy"
        />

        {/* Acid discount badge — Russo One */}
        <div className="absolute top-0 left-0 bg-acid text-black px-3 py-1.5 ga-price text-[15px] leading-none rounded-br-2xl rounded-tl-[28px]">
          -{priceInfo.discountPercent}%
        </div>

        {/* Urgent timer */}
        {countdown && countdown.isUrgent && !countdown.expired && (
          <div className="absolute bottom-2.5 right-2.5 bg-error text-white px-2 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 animate-pulse">
            <Clock size={9} />
            {countdown.minutes}:{String(countdown.seconds).padStart(2, '0')}
          </div>
        )}

        {/* Favorite */}
        <motion.button
          onClick={handleFavoriteClick}
          onPointerDown={(e) => e.stopPropagation()}
          whileTap={{ scale: 0.85 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={`
            absolute top-2.5 right-2.5 z-20 p-2 rounded-full transition-colors
            ${isFavorite ? 'bg-black text-acid' : 'bg-white/50 text-black backdrop-blur-sm'}
          `}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>

        {/* In-cart badge */}
        {inCart && (
          <div className="absolute bottom-2.5 left-2.5 bg-black text-acid px-2 py-1 rounded-xl text-[9px] ga-button">
            ×{cartItem.qty}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-0.5">
        <p className="ga-body text-[11px] text-gray-700 line-clamp-2 leading-snug min-h-[30px]">
          {product.title}
        </p>

        {/* Countdown */}
        {countdown && !countdown.expired && !countdown.isUrgent && (
          <div className="flex items-center gap-1 mt-1">
            <Clock size={9} className="text-gray-400" />
            <span className="text-[9px] font-semibold text-gray-400">
              {countdown.hours > 0 ? `${countdown.hours}ч` : `${countdown.minutes}мин`}
            </span>
          </div>
        )}

        <div className="flex items-end justify-between mt-1.5">
          <div>
            <span className="ga-price-old text-[10px] block">
              ₽{product.basePrice}
            </span>
            <span className="ga-price text-[22px] text-black leading-none block">
              ₽{priceInfo.unitPrice}
            </span>
          </div>

          {/* Cart controls */}
          {inCart ? (
            <div className="flex items-center bg-black rounded-xl overflow-hidden">
              <motion.button
                onClick={handleDecrement}
                onPointerDown={(e) => e.stopPropagation()}
                whileTap={{ scale: 0.85 }}
                className="p-2 text-acid"
              >
                <Minus size={13} strokeWidth={2.5} />
              </motion.button>
              <span className="ga-price text-[13px] text-acid min-w-[20px] text-center">
                {cartItem.qty}
              </span>
              <motion.button
                onClick={handleIncrement}
                onPointerDown={(e) => e.stopPropagation()}
                whileTap={{ scale: 0.85 }}
                className="p-2 text-acid"
              >
                <Plus size={13} strokeWidth={2.5} />
              </motion.button>
            </div>
          ) : (
            <motion.button
              onClick={handleAddToCart}
              onPointerDown={(e) => e.stopPropagation()}
              whileTap={{ scale: 0.85 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className="bg-black text-acid p-2.5 rounded-xl"
            >
              <Plus size={15} strokeWidth={2.5} />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
