const express = require('express');
const router = express.Router();
const { getStats, getUsers, deleteUser } = require('../controllers/adminController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// Admin-only routes
// Verify token and ensure user has admin role
router.use(verifyToken, authorizeRole('admin'));

// Get admin dashboard statistics
router.get('/stats', getStats);

// Get all users (with optional search filter)
router.get('/users', getUsers);

// Delete a user by ID
router.delete('/users/:id', deleteUser);

module.exports = router;
