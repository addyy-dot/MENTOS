const express = require('express');
const router = express.Router();
const { 
  createRequest, 
  getRequests, 
  updateRequestStatus, 
  scheduleRequest 
} = require('../controllers/requestController');
const { verifyToken, authorizeRole } = require('../middleware/authMiddleware');

// All routes are protected
router.use(verifyToken);

// Create request (Mentees only)
router.post('/', authorizeRole('mentee'), createRequest);

// Retrieve requests (Mentors and Mentees)
router.get('/', getRequests);

// Update request status (Mentors only)
router.patch('/:id/status', authorizeRole('mentor'), updateRequestStatus);

// Schedule request session (Mentors only)
router.patch('/:id/schedule', authorizeRole('mentor'), scheduleRequest);

module.exports = router;
