const express = require('express');
const router = express.Router();
const { register, login, getMe, editProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', verifyToken, getMe);
router.patch('/profile', verifyToken, editProfile);

module.exports = router;
