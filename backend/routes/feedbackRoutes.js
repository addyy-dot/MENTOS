const express = require('express');
const router = express.Router();
const { createFeedback, getFeedbackByRequestId } = require('../controllers/feedbackController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// All routes are protected
router.use(verifyToken);

// Submit feedback (Mentees only)
router.post('/', authorizeRole('mentee'), createFeedback);

// Get feedback by request ID (Mentor and Mentee)
router.get('/:requestId', getFeedbackByRequestId);

module.exports = router;
