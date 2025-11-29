const { verifyAccessToken } = require('../utils/jwt.util');
const { prisma } = require('../config/database');
const { createError } = require('../utils/helpers');

/**
 * Authentication middleware - Verify JWT token
 */
async function authenticate(req, res, next) {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json(
        createError('UNAUTHORIZED', 'No token provided')
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyAccessToken(token);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(401).json(
        createError('UNAUTHORIZED', 'User not found')
      );
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json(
        createError('FORBIDDEN', 'Account is not active')
      );
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json(
      createError('UNAUTHORIZED', 'Invalid or expired token')
    );
  }
}

/**
 * Optional authentication - Attach user if token present but don't fail
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyAccessToken(token);
      
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      
      if (user && user.status === 'ACTIVE') {
        req.user = user;
      }
    }
  } catch (error) {
    // Silently fail
  }
  next();
}

module.exports = { authenticate, optionalAuth };

