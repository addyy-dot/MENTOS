const express = require('express');
const router = express.Router();
const { getMentors, getMentorById } = require('../controllers/mentorController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected routes (both mentors and mentees can access)
router.get('/', verifyToken, getMentors);
router.get('/:id', verifyToken, getMentorById);

module.exports = router;
