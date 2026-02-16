/**
 * Format phone number for display
 * @param {string} value - Raw phone input
 * @returns {string} Formatted phone number
 */
export const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (!digits) return '+7';

  let result = '+7';

  if (digits.length > 1) {
    result += ' (' + digits.slice(1, 4);
  }
  if (digits.length >= 5) {
    result += ') ' + digits.slice(4, 7);
  }
  if (digits.length >= 8) {
    result += '-' + digits.slice(7, 9);
  }
  if (digits.length >= 10) {
    result += '-' + digits.slice(9, 11);
  }

  return result;
};

/**
 * Check if phone number is valid
 * @param {string} phone - Formatted phone number
 * @returns {boolean} Is valid
 */
export const isValidPhone = (phone) => {
  return phone.length >= 18;
};

/**
 * Extract digits from phone number
 * @param {string} phone - Formatted phone number
 * @returns {string} Only digits
 */
export const extractDigits = (phone) => {
  return phone.replace(/\D/g, '');
};
