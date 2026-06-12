const Feedback = require('../models/feedback');
const Request = require('../models/request');
const User = require('../models/user');

// Create Feedback for a completed session (Mentee only)
const createFeedback = async (req, res) => {
  try {
    const { requestId, rating, comments } = req.body;
    const menteeId = req.user.id;

    if (!requestId || !rating || !comments) {
      return res.status(400).json({ message: 'Request ID, rating, and comments are required.' });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }

    // Check if the request exists and is completed
    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Session request not found.' });
    }

    // Verify it is completed
    if (request.status !== 'Completed') {
      return res.status(400).json({ message: 'Feedback can only be submitted for completed sessions.' });
    }

    // Verify this mentee is the one who created the request
    if (request.menteeId.toString() !== menteeId) {
      return res.status(403).json({ message: 'Access denied. Only the assigned mentee can submit feedback.' });
    }

    // Check if feedback already exists for this request
    const existingFeedback = await Feedback.findOne({ requestId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback has already been submitted for this session.' });
    }

    // Create Feedback
    const feedback = new Feedback({
      requestId,
      mentorId: request.mentorId,
      menteeId,
      rating: numRating,
      comments,
    });

    await feedback.save();

    // Recalculate Mentor Average Rating
    const feedbacks = await Feedback.find({ mentorId: request.mentorId });
    const totalRating = feedbacks.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = feedbacks.length > 0 ? (totalRating / feedbacks.length).toFixed(1) : 0;

    await User.findByIdAndUpdate(request.mentorId, { rating: Number(averageRating) });

    res.status(201).json({
      message: 'Feedback submitted successfully.',
      feedback,
      mentorAverageRating: averageRating,
    });
  } catch (error) {
    console.error('CreateFeedback Error:', error);
    res.status(500).json({ message: 'Server error submitting feedback.', error: error.message });
  }
};

// Get feedback details for a specific request
const getFeedbackByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user.id;

    const feedback = await Feedback.findOne({ requestId })
      .populate('menteeId', 'fullName email branch year')
      .populate('mentorId', 'fullName email branch companiesCracked expertise');

    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found for this request.' });
    }

    // Validate that the request user is either the mentor or the mentee
    if (feedback.menteeId._id.toString() !== userId && feedback.mentorId._id.toString() !== userId) {
      return res.status(403).json({ message: 'Access denied. You are not authorized to view this feedback.' });
    }

    res.status(200).json({ feedback });
  } catch (error) {
    console.error('GetFeedbackByRequestId Error:', error);
    res.status(500).json({ message: 'Server error retrieving feedback.', error: error.message });
  }
};

module.exports = {
  createFeedback,
  getFeedbackByRequestId,
};
