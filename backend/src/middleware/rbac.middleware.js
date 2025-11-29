const { USER_ROLES } = require('../config/constants');
const { createError } = require('../utils/helpers');

/**
 * Role-based access control middleware
 * @param {...string} allowedRoles - Allowed roles
 */
function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        createError('UNAUTHORIZED', 'Authentication required')
      );
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json(
        createError('FORBIDDEN', 'Insufficient permissions')
      );
    }

    next();
  };
}

/**
 * Check if user is admin
 */
const isAdmin = authorize(USER_ROLES.ADMIN);

/**
 * Check if user is tutor
 */
const isTutor = authorize(USER_ROLES.TUTOR);

/**
 * Check if user is parent
 */
const isParent = authorize(USER_ROLES.PARENT);

/**
 * Check if user is supervisor
 */
const isSupervisor = authorize(USER_ROLES.SUPERVISOR);

/**
 * Check if user is admin or supervisor
 */
const isAdminOrSupervisor = authorize(USER_ROLES.ADMIN, USER_ROLES.SUPERVISOR);

/**
 * Check if user is tutor or admin
 */
const isTutorOrAdmin = authorize(USER_ROLES.TUTOR, USER_ROLES.ADMIN);

/**
 * Check if user owns the resource
 * @param {string} param - Request parameter name containing user ID
 */
function isOwner(param = 'id') {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json(
        createError('UNAUTHORIZED', 'Authentication required')
      );
    }

    const resourceUserId = req.params[param] || req.body.userId;

    if (req.user.role === USER_ROLES.ADMIN) {
      // Admins can access any resource
      return next();
    }

    if (req.user.id !== resourceUserId) {
      return res.status(403).json(
        createError('FORBIDDEN', 'You can only access your own resources')
      );
    }

    next();
  };
}

module.exports = {
  authorize,
  isAdmin,
  isTutor,
  isParent,
  isSupervisor,
  isAdminOrSupervisor,
  isTutorOrAdmin,
  isOwner,
};

