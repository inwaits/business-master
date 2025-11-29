const express = require('express');
const notificationService = require('../services/notification.service');
const { authenticate } = require('../middleware/auth.middleware');
const { asyncHandler } = require('../middleware/errorHandler.middleware');
const { createResponse } = require('../utils/helpers');

const router = express.Router();

router.use(authenticate);

/**
 * @route   GET /api/v1/notifications
 * @desc    Get user notifications
 * @access  Private
 */
router.get('/', asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, unreadOnly = false } = req.query;
  const result = await notificationService.getUserNotifications(
    req.user.id,
    parseInt(page),
    parseInt(limit),
    unreadOnly === 'true'
  );
  res.json(createResponse(true, result));
}));

/**
 * @route   PATCH /api/v1/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
router.patch('/:id/read', asyncHandler(async (req, res) => {
  await notificationService.markAsRead(req.params.id, req.user.id);
  res.json(createResponse(true, null, 'Notification marked as read'));
}));

/**
 * @route   PATCH /api/v1/notifications/read-all
 * @desc    Mark all notifications as read
 * @access  Private
 */
router.patch('/read-all', asyncHandler(async (req, res) => {
  await notificationService.markAllAsRead(req.user.id);
  res.json(createResponse(true, null, 'All notifications marked as read'));
}));

/**
 * @route   DELETE /api/v1/notifications/:id
 * @desc    Delete notification
 * @access  Private
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  await notificationService.deleteNotification(req.params.id, req.user.id);
  res.json(createResponse(true, null, 'Notification deleted'));
}));

module.exports = router;

