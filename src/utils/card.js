/**
 * Card validation utilities
 */

/**
 * Luhn algorithm for card number validation
 * @param {string} cardNumber - Card number (digits only)
 * @returns {boolean} - Is valid
 */
export const luhnCheck = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Detect card brand from BIN (first digits)
 * @param {string} cardNumber - Card number
 * @returns {'visa' | 'mastercard' | 'mir' | null} - Card brand
 */
export const detectCardBrand = (cardNumber) => {
  const digits = cardNumber.replace(/\D/g, '');
  
  if (!digits) return null;
  
  // Visa starts with 4
  if (digits.startsWith('4')) return 'visa';
  
  // Mastercard starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(digits)) return 'mastercard';
  if (/^2[2-7]/.test(digits)) return 'mastercard';
  
  // Mir starts with 2200-2204
  if (/^220[0-4]/.test(digits)) return 'mir';
  
  return null;
};

/**
 * Format card number with spaces (XXXX XXXX XXXX XXXX)
 * @param {string} value - Raw input
 * @returns {string} - Formatted card number
 */
export const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : '';
};

/**
 * Format expiry date (MM / YY)
 * @param {string} value - Raw input
 * @returns {string} - Formatted expiry
 */
export const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  
  if (digits.length === 0) return '';
  if (digits.length <= 2) return digits;
  
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
};

/**
 * Validate expiry date (not in past)
 * @param {string} expiry - Expiry in "MM / YY" format
 * @returns {boolean} - Is valid
 */
export const validateExpiry = (expiry) => {
  const match = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = parseInt(`20${match[2]}`, 10);

  if (month < 1 || month > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear) return false;
  if (year === currentYear && month < currentMonth) return false;

  return true;
};

/**
 * Validate CVC (3 digits)
 * @param {string} cvc - CVC code
 * @returns {boolean} - Is valid
 */
export const validateCVC = (cvc) => {
  return /^\d{3}$/.test(cvc);
};

/**
 * Parse expiry to month and year
 * @param {string} expiry - Expiry in "MM / YY" format
 * @returns {{ month: number, year: number } | null}
 */
export const parseExpiry = (expiry) => {
  const match = expiry.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!match) return null;
  
  return {
    month: parseInt(match[1], 10),
    year: parseInt(`20${match[2]}`, 10),
  };
};

/**
 * Get card brand icon color
 * @param {'visa' | 'mastercard' | 'mir' | null} brand
 * @returns {string} - Color hex
 */
export const getCardBrandColor = (brand) => {
  switch (brand) {
    case 'visa': return '#1A1F71';
    case 'mastercard': return '#EB001B';
    case 'mir': return '#4DB45E';
    default: return '#999999';
  }
};
