const express = require('express');
const sessionController = require('../controllers/session.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { isTutor } = require('../middleware/rbac.middleware');

const router = express.Router();

router.use(authenticate);

router.get('/', sessionController.getSessions);
router.get('/:id', sessionController.getSessionById);
router.post('/:id/attendance', isTutor, sessionController.markAttendance);
router.post('/:id/report', isTutor, sessionController.submitReport);
router.post('/:id/cancel', sessionController.cancelSession);

module.exports = router;

