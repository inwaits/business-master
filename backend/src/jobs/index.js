const cron = require('node-cron');
const { cleanExpiredTokens } = require('../utils/jwt.util');
const { cleanOldNotifications } = require('../services/notification.service');

/**
 * Clean expired refresh tokens
 * Runs every day at midnight
 */
cron.schedule('0 0 * * *', async () => {
  console.log('🕐 Running scheduled job: Clean expired tokens');
  try {
    await cleanExpiredTokens();
  } catch (error) {
    console.error('❌ Token cleanup job failed:', error);
  }
});

/**
 * Clean old notifications
 * Runs every day at 1 AM
 */
cron.schedule('0 1 * * *', async () => {
  console.log('🕐 Running scheduled job: Clean old notifications');
  try {
    await cleanOldNotifications();
  } catch (error) {
    console.error('❌ Notification cleanup job failed:', error);
  }
});

/**
 * Send session reminders
 * Runs every hour
 */
cron.schedule('0 * * * *', async () => {
  console.log('🕐 Running scheduled job: Send session reminders');
  try {
    // Will implement session reminder logic
  } catch (error) {
    console.error('❌ Session reminder job failed:', error);
  }
});

console.log('✅ Cron jobs initialized');

module.exports = {};

