// Error handler utility for notification durations

/**
 * Gets the error message from error object as-is
 * @param {Error|string} error - Error object or message
 * @param {string} defaultMessage - Default message if no error message found
 * @returns {string} Error message
 */
export function getUserFriendlyErrorMessage(error, defaultMessage = 'Bir hata oluştu') {
  const errorMessage = typeof error === 'string' ? error : (error?.message || error?.toString() || '')
  
  if (errorMessage && errorMessage.trim()) {
    return errorMessage
  }
  
  return defaultMessage
}

/**
 * Notification timeout duration in milliseconds
 */
export const NOTIFICATION_DURATION = 6000 // 6 seconds (was 3 seconds)

/**
 * Error notification timeout duration in milliseconds
 * Errors stay longer to give user time to read
 */
export const ERROR_NOTIFICATION_DURATION = 8000 // 8 seconds for errors

/**
 * Normalize Turkish characters for search
 * Converts Turkish characters to their ASCII equivalents
 * @param {string} text - Text to normalize
 * @returns {string} Normalized text
 */
export function normalizeTurkish(text) {
  if (!text) return ''
  
  return text
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/İ/g, 'i')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .toLowerCase()
}
