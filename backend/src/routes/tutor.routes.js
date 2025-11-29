const express = require('express');
const tutorController = require('../controllers/tutor.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isTutor, isTutorOrAdmin } = require('../middleware/rbac.middleware');

const router = express.Router();

// Public/authenticated routes
router.get('/search', authenticate, tutorController.searchTutors);
router.get('/:id', authenticate, tutorController.getTutorById);

// Tutor-only routes
router.use(authenticate, isTutor);
router.get('/profile', tutorController.getProfile);
router.put('/profile/complete', tutorController.completeProfile);
router.put('/subjects', tutorController.updateSubjects);
router.put('/availability', tutorController.updateAvailability);
router.get('/sessions', tutorController.getSessions);
router.get('/earnings', tutorController.getEarnings);

module.exports = router;

