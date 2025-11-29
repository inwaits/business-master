const {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  calculateTokenExpiry,
  JWT_ACCESS_EXPIRES_IN,
} = require('../config/jwt');
const { prisma } = require('../config/database');

/**
 * Generate tokens for a user
 * @param {object} user - User object
 * @returns {object} Access and refresh tokens
 */
async function generateTokens(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token in database
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: calculateTokenExpiry(process.env.JWT_REFRESH_EXPIRES_IN || '7d'),
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresIn: getExpirySeconds(JWT_ACCESS_EXPIRES_IN),
  };
}

/**
 * Refresh access token
 * @param {string} refreshToken - Refresh token
 * @returns {object} New access token
 */
async function refreshAccessToken(refreshToken) {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Check if refresh token exists in database
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken) {
    throw new Error('Invalid refresh token');
  }

  if (storedToken.expiresAt < new Date()) {
    // Delete expired token
    await prisma.refreshToken.delete({
      where: { id: storedToken.id },
    });
    throw new Error('Refresh token expired');
  }

  // Generate new access token
  const payload = {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };

  const accessToken = generateAccessToken(payload);

  return {
    accessToken,
    expiresIn: getExpirySeconds(JWT_ACCESS_EXPIRES_IN),
  };
}

/**
 * Revoke refresh token
 * @param {string} refreshToken - Refresh token to revoke
 */
async function revokeRefreshToken(refreshToken) {
  await prisma.refreshToken.deleteMany({
    where: { token: refreshToken },
  });
}

/**
 * Revoke all user's refresh tokens
 * @param {string} userId - User ID
 */
async function revokeAllUserTokens(userId) {
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });
}

/**
 * Clean expired tokens (run as cron job)
 */
async function cleanExpiredTokens() {
  const deleted = await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  });
  console.log(`🧹 Cleaned ${deleted.count} expired refresh tokens`);
}

/**
 * Convert expiry string to seconds
 * @param {string} expiresIn - e.g., '15m', '7d'
 * @returns {number} Seconds
 */
function getExpirySeconds(expiresIn) {
  const units = { s: 1, m: 60, h: 3600, d: 86400 };
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (!match) return 900; // Default 15 minutes
  const [, value, unit] = match;
  return parseInt(value) * units[unit];
}

module.exports = {
  generateTokens,
  refreshAccessToken,
  revokeRefreshToken,
  revokeAllUserTokens,
  cleanExpiredTokens,
  verifyAccessToken,
  verifyRefreshToken,
};

