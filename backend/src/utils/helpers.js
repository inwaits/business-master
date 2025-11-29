/**
 * Format pagination parameters
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @returns {object} Skip and take values for Prisma
 */
function formatPagination(page = 1, limit = 10) {
  const parsedPage = Math.max(1, parseInt(page));
  const parsedLimit = Math.min(100, Math.max(1, parseInt(limit)));

  return {
    skip: (parsedPage - 1) * parsedLimit,
    take: parsedLimit,
  };
}

/**
 * Calculate pagination metadata
 * @param {number} total - Total items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @returns {object} Pagination metadata
 */
function getPaginationMeta(total, page, limit) {
  const totalPages = Math.ceil(total / limit);

  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Generate random code
 * @param {number} length - Code length
 * @returns {string} Random code
 */
function generateRandomCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Format currency (Rs.)
 * @param {number} amount - Amount
 * @returns {string} Formatted currency
 */
function formatCurrency(amount) {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

/**
 * Calculate percentage
 * @param {number} value - Value
 * @param {number} percentage - Percentage (0-1)
 * @returns {number} Calculated amount
 */
function calculatePercentage(value, percentage) {
  return Math.round(value * percentage * 100) / 100;
}

/**
 * Sanitize filename
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filename) {
  return filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .toLowerCase();
}

/**
 * Check if time slot overlaps
 * @param {string} start1 - Start time 1 (HH:mm)
 * @param {string} end1 - End time 1 (HH:mm)
 * @param {string} start2 - Start time 2 (HH:mm)
 * @param {string} end2 - End time 2 (HH:mm)
 * @returns {boolean} True if overlaps
 */
function checkTimeOverlap(start1, end1, start2, end2) {
  const toMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const s1 = toMinutes(start1);
  const e1 = toMinutes(end1);
  const s2 = toMinutes(start2);
  const e2 = toMinutes(end2);

  return s1 < e2 && s2 < e1;
}

/**
 * Group array by key
 * @param {Array} array - Array to group
 * @param {string} key - Key to group by
 * @returns {object} Grouped object
 */
function groupBy(array, key) {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
}

/**
 * Remove undefined/null values from object
 * @param {object} obj - Object to clean
 * @returns {object} Cleaned object
 */
function cleanObject(obj) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

/**
 * Create API response
 * @param {boolean} success - Success status
 * @param {object} data - Response data
 * @param {string} message - Response message
 * @returns {object} API response object
 */
function createResponse(success, data = null, message = null) {
  const response = { success };
  
  if (message) response.message = message;
  if (data) response.data = data;
  
  return response;
}

/**
 * Create error response
 * @param {string} code - Error code
 * @param {string} message - Error message
 * @param {object} details - Error details
 * @returns {object} Error response object
 */
function createError(code, message, details = null) {
  const error = { code, message };
  if (details) error.details = details;
  return { success: false, error };
}

module.exports = {
  formatPagination,
  getPaginationMeta,
  generateRandomCode,
  sleep,
  formatCurrency,
  calculatePercentage,
  sanitizeFilename,
  checkTimeOverlap,
  groupBy,
  cleanObject,
  createResponse,
  createError,
};

