const { prisma } = require('../config/database');
const { NOTIFICATION_TYPES } = require('../config/constants');

/**
 * Create notification
 * @param {string} userId - User ID
 * @param {string} type - Notification type
 * @param {string} title - Notification title
 * @param {string} message - Notification message
 * @param {object} metadata - Additional metadata
 */
async function createNotification(userId, type, title, message, metadata = null) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        metadata,
      },
    });

    // Emit socket event if io is available
    const io = global.io;
    if (io) {
      io.to(`user:${userId}`).emit('new_notification', notification);
    }

    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
}

/**
 * Create notifications for multiple users
 */
async function createBulkNotifications(userIds, type, title, message, metadata = null) {
  const notifications = userIds.map((userId) => ({
    userId,
    type,
    title,
    message,
    metadata,
  }));

  const created = await prisma.notification.createMany({
    data: notifications,
  });

  // Emit socket events
  const io = global.io;
  if (io) {
    userIds.forEach((userId) => {
      io.to(`user:${userId}`).emit('new_notification', {
        type,
        title,
        message,
      });
    });
  }

  return created;
}

/**
 * Get user notifications
 */
async function getUserNotifications(userId, page = 1, limit = 20, unreadOnly = false) {
  const skip = (page - 1) * limit;

  const where = { userId };
  if (unreadOnly) {
    where.isRead = false;
  }

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where }),
  ]);

  const unreadCount = await prisma.notification.count({
    where: { userId, isRead: false },
  });

  return {
    notifications,
    total,
    unreadCount,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Mark notification as read
 */
async function markAsRead(notificationId, userId) {
  return prisma.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
    },
  });
}

/**
 * Mark all notifications as read
 */
async function markAllAsRead(userId) {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });
}

/**
 * Delete notification
 */
async function deleteNotification(notificationId, userId) {
  return prisma.notification.deleteMany({
    where: {
      id: notificationId,
      userId,
    },
  });
}

/**
 * Delete old notifications (older than 30 days)
 */
async function cleanOldNotifications() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const deleted = await prisma.notification.deleteMany({
    where: {
      createdAt: {
        lt: thirtyDaysAgo,
      },
      isRead: true,
    },
  });

  console.log(`🧹 Cleaned ${deleted.count} old notifications`);
  return deleted;
}

module.exports = {
  createNotification,
  createBulkNotifications,
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  cleanOldNotifications,
};

