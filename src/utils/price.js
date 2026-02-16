/**
 * Calculate prices with discounts based on expiry and quantity
 * @param {Object} product - Product object with basePrice and expiryDate
 * @param {number} quantity - Quantity to purchase
 * @returns {Object} Price breakdown
 */
export const calculatePrices = (product, quantity = 1) => {
  if (!product) {
    return { 
      unitPrice: 0, 
      totalPrice: 0, 
      discountPercent: 0, 
      bulkBonusPercent: 0 
    };
  }

  const hoursUntilExpiry = (new Date(product.expiryDate) - Date.now()) / 3600000;

  // Time-based discount
  let timeDiscount;
  if (hoursUntilExpiry < 12) {
    timeDiscount = 0.7;
  } else if (hoursUntilExpiry < 24) {
    timeDiscount = 0.5;
  } else {
    timeDiscount = 0.3;
  }

  const baseRobinPrice = Math.floor(product.basePrice * (1 - timeDiscount));

  // Bulk discount
  let bulkBonus;
  if (quantity >= 10) {
    bulkBonus = 0.35;
  } else if (quantity >= 6) {
    bulkBonus = 0.20;
  } else if (quantity >= 3) {
    bulkBonus = 0.10;
  } else {
    bulkBonus = 0;
  }

  const unitPrice = Math.floor(baseRobinPrice * (1 - bulkBonus));
  const totalPrice = unitPrice * quantity;
  const discountPercent = Math.round((1 - unitPrice / product.basePrice) * 100);
  const bulkBonusPercent = Math.round(bulkBonus * 100);

  return {
    unitPrice,
    totalPrice,
    discountPercent,
    bulkBonusPercent,
  };
};

/**
 * Format price with currency symbol
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol
 * @returns {string} Formatted price
 */
export const formatPrice = (price, currency = '₽') => {
  return `${currency}${price.toLocaleString('ru-RU')}`;
};
