const express = require('express');
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { registerSchema, loginSchema, changePasswordSchema } = require('../validators/auth.validator');

const router = express.Router();

// Public routes
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);

// Protected routes
router.use(authenticate);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);
router.put('/change-password', validate(changePasswordSchema), authController.changePassword);

module.exports = router;

