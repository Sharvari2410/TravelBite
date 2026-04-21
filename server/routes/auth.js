const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/me - Get current user profile
router.get('/me', authController.getProfile);

// PUT /api/auth/me - Update user profile
router.put('/me', authController.updateProfile);

// POST /api/auth/google - Google Sign-In
router.post('/google', authController.googleSignIn);

// POST /api/auth/google/link - Link Google account to existing user
router.post('/google/link', authController.linkGoogleAccount);

module.exports = router;