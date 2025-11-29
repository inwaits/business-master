const authService = require('../services/auth.service');
const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { createResponse } = require('../utils/helpers');

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  
  res.status(201).json(
    createResponse(true, result, 'Registration successful')
  );
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  
  res.status(200).json(
    createResponse(true, result, 'Login successful')
  );
});

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refresh(refreshToken);
  
  res.status(200).json(
    createResponse(true, result)
  );
});

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.logout(refreshToken);
  
  res.status(200).json(
    createResponse(true, null, result.message)
  );
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);
  
  res.status(200).json(
    createResponse(true, { user })
  );
});

/**
 * @route   PUT /api/v1/auth/change-password
 * @desc    Change password
 * @access  Private
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const result = await authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );
  
  res.status(200).json(
    createResponse(true, null, result.message)
  );
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await authService.requestPasswordReset(email);
  
  res.status(200).json(
    createResponse(true, null, result.message)
  );
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  getMe,
  changePassword,
  forgotPassword,
};

