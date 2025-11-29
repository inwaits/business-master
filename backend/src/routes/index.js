const express = require('express');
const authRoutes = require('./auth.routes');
const tutorRoutes = require('./tutor.routes');
const parentRoutes = require('./parent.routes');
const matchingRoutes = require('./matching.routes');
const sessionRoutes = require('./session.routes');
const notificationRoutes = require('./notification.routes');
const commonRoutes = require('./common.routes');

const router = express.Router();

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/tutors', tutorRoutes);
router.use('/parents', parentRoutes);
router.use('/matching', matchingRoutes);
router.use('/sessions', sessionRoutes);
router.use('/notifications', notificationRoutes);
router.use('/common', commonRoutes);

// TODO: Add these routes when created
// router.use('/admin', adminRoutes);
// router.use('/supervisor', supervisorRoutes);
// router.use('/payments', paymentRoutes);

module.exports = router;
