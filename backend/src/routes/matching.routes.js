const express = require('express');
const matchingController = require('../controllers/matching.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isParent, isTutor } = require('../middleware/rbac.middleware');

const router = express.Router();

router.use(authenticate);

// Parent routes
router.post('/request', isParent, matchingController.createMatchRequest);
router.post('/:id/confirm', isParent, matchingController.confirmMatch);

// Tutor routes
router.get('/notifications', isTutor, matchingController.getMatchNotifications);
router.post('/:id/accept', isTutor, matchingController.acceptMatch);

module.exports = router;

