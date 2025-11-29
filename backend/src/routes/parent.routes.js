const express = require('express');
const parentController = require('../controllers/parent.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isParent } = require('../middleware/rbac.middleware');

const router = express.Router();

// All routes require parent role
router.use(authenticate, isParent);

router.get('/profile', parentController.getProfile);
router.put('/profile', parentController.updateProfile);
router.get('/dashboard', parentController.getDashboard);
router.post('/students', parentController.addStudent);
router.put('/students/:id', parentController.updateStudent);
router.post('/reviews', parentController.submitReview);
router.post('/complaints', parentController.submitComplaint);

module.exports = router;

