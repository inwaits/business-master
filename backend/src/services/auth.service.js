const { prisma } = require('../config/database');
const { hashPassword, comparePassword, validatePasswordStrength } = require('../utils/password.util');
const { generateTokens, refreshAccessToken, revokeRefreshToken } = require('../utils/jwt.util');
const { USER_ROLES, ACCOUNT_STATUS } = require('../config/constants');
const { sendWelcomeEmail } = require('./email.service');
const { ValidationError, UnauthorizedError, ConflictError } = require('../middleware/errorHandler.middleware');

/**
 * Register new user
 */
async function register(userData) {
  const { email, password, role, ...profileData } = userData;

  // Validate password strength
  const passwordValidation = validatePasswordStrength(password);
  if (!passwordValidation.isValid) {
    throw new ValidationError('Weak password', passwordValidation.errors);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new ConflictError('Email already registered');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user with profile based on role
  let user;

  if (role === USER_ROLES.TUTOR) {
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        status: ACCOUNT_STATUS.PENDING,
        tutor: {
          create: {
            fullName: profileData.fullName,
            nicPassport: profileData.nicPassport,
            phoneNumber: profileData.phoneNumber,
            dateOfBirth: new Date(profileData.dateOfBirth),
            address: profileData.address,
            city: profileData.city,
            province: profileData.province,
            university: profileData.university,
            degree: profileData.degree,
            graduationYear: parseInt(profileData.graduationYear),
            yearsOfExperience: parseInt(profileData.yearsOfExperience) || 0,
            bio: profileData.bio,
          },
        },
      },
      include: {
        tutor: true,
      },
    });
  } else if (role === USER_ROLES.PARENT) {
    user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        status: ACCOUNT_STATUS.ACTIVE,
        parent: {
          create: {
            fullName: profileData.fullName,
            phoneNumber: profileData.phoneNumber,
            address: profileData.address,
            city: profileData.city,
            province: profileData.province,
            students: {
              create: profileData.students || [],
            },
          },
        },
      },
      include: {
        parent: {
          include: {
            students: true,
          },
        },
      },
    });
  } else {
    throw new ValidationError('Invalid role for registration');
  }

  // Send welcome email
  try {
    await sendWelcomeEmail(user);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }

  // Generate tokens
  const tokens = await generateTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

/**
 * Login user
 */
async function login(email, password) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      tutor: true,
      parent: true,
      supervisor: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  // Check account status
  if (user.status === ACCOUNT_STATUS.SUSPENDED) {
    throw new UnauthorizedError('Account is suspended');
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  // Generate tokens
  const tokens = await generateTokens(user);

  return {
    user: sanitizeUser(user),
    ...tokens,
  };
}

/**
 * Refresh access token
 */
async function refresh(refreshToken) {
  return refreshAccessToken(refreshToken);
}

/**
 * Logout user
 */
async function logout(refreshToken) {
  await revokeRefreshToken(refreshToken);
  return { message: 'Logged out successfully' };
}

/**
 * Get current user
 */
async function getCurrentUser(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tutor: true,
      parent: {
        include: {
          students: true,
        },
      },
      supervisor: true,
    },
  });

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return sanitizeUser(user);
}

/**
 * Change password
 */
async function changePassword(userId, currentPassword, newPassword) {
  // Get user
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  // Verify current password
  const isValid = await comparePassword(currentPassword, user.password);
  if (!isValid) {
    throw new UnauthorizedError('Current password is incorrect');
  }

  // Validate new password
  const passwordValidation = validatePasswordStrength(newPassword);
  if (!passwordValidation.isValid) {
    throw new ValidationError('Weak password', passwordValidation.errors);
  }

  // Hash new password
  const hashedPassword = await hashPassword(newPassword);

  // Update password
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Revoke all refresh tokens
  await prisma.refreshToken.deleteMany({
    where: { userId },
  });

  return { message: 'Password changed successfully' };
}

/**
 * Request password reset
 */
async function requestPasswordReset(email) {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    // Don't reveal if user exists
    return { message: 'If email exists, reset link will be sent' };
  }

  // Generate reset token (you'd implement proper token generation)
  const resetToken = require('crypto').randomBytes(32).toString('hex');
  
  // Store reset token with expiry (you'd need to add this to schema)
  // For now, we'll just send the email
  
  const { sendPasswordResetEmail } = require('./email.service');
  await sendPasswordResetEmail(user.email, resetToken);

  return { message: 'Password reset email sent' };
}

/**
 * Sanitize user object (remove sensitive data)
 */
function sanitizeUser(user) {
  const { password, ...sanitized } = user;
  return sanitized;
}

module.exports = {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
  changePassword,
  requestPasswordReset,
};

