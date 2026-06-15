const Request = require('../models/request');
const User = require('../models/user');

// Create a new mentorship request (Mentee only)
const createRequest = async (req, res) => {
  try {
    const { mentorId, requestMessage } = req.body;
    const menteeId = req.user.id;

    if (!mentorId || !requestMessage) {
      return res.status(400).json({ message: 'Mentor ID and request message are required.' });
    }

    // Check if mentor exists and has mentor role
    const mentor = await User.findOne({ _id: mentorId, role: 'mentor' });
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found.' });
    }

    // Check if there is already a pending or scheduled request between this mentee and mentor
    const activeRequest = await Request.findOne({
      menteeId,
      mentorId,
      status: { $in: ['Pending', 'Accepted', 'Scheduled'] },
    });

    if (activeRequest) {
      return res.status(400).json({ 
        message: 'You already have an active request (Pending/Accepted/Scheduled) with this mentor.' 
      });
    }

    const newRequest = new Request({
      menteeId,
      mentorId,
      requestMessage,
      status: 'Pending',
    });

    await newRequest.save();

    res.status(201).json({
      message: 'Mentorship request sent successfully.',
      request: newRequest,
    });
  } catch (error) {
    console.error('CreateRequest Error:', error);
    res.status(500).json({ message: 'Server error creating request.', error: error.message });
  }
};

// Get requests (Role-aware)
const getRequests = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    let requests;

    if (role === 'mentee') {
      requests = await Request.find({ menteeId: userId })
        .populate('mentorId', 'fullName email branch bio skills companiesCracked expertise availability rating')
        .sort({ createdAt: -1 });
    } else if (role === 'mentor') {
      requests = await Request.find({ mentorId: userId })
        .populate('menteeId', 'fullName email branch year bio skills targetCompanies targetSkills collegeName targetRole')
        .sort({ createdAt: -1 });
    } else {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    res.status(200).json({ requests });
  } catch (error) {
    console.error('GetRequests Error:', error);
    res.status(500).json({ message: 'Server error retrieving requests.', error: error.message });
  }
};

// Update Request Status (Accept / Reject / Complete) (Mentor only)
const updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const requestId = req.params.id;
    const mentorId = req.user.id;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    // Valid statuses that can be patched directly
    const validStatuses = ['Accepted', 'Rejected', 'Completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Check if the current user is the mentor for this request
    if (request.mentorId.toString() !== mentorId) {
      return res.status(403).json({ message: 'Access denied. Only the assigned mentor can modify this request.' });
    }

    const currentStatus = request.status;

    // Validate Status Transitions:
    // Pending -> Accepted or Rejected
    // Scheduled -> Completed
    if (status === 'Accepted' || status === 'Rejected') {
      if (currentStatus !== 'Pending') {
        return res.status(400).json({ 
          message: `Cannot transition request from status "${currentStatus}" to "${status}". Request must be "Pending".` 
        });
      }
    } else if (status === 'Completed') {
      if (currentStatus !== 'Scheduled') {
        return res.status(400).json({ 
          message: `Cannot transition request from status "${currentStatus}" to "${status}". Request must be "Scheduled".` 
        });
      }
    }

    // Update status
    request.status = status;
    await request.save();

    res.status(200).json({
      message: `Request status updated to ${status} successfully.`,
      request,
    });
  } catch (error) {
    console.error('UpdateRequestStatus Error:', error);
    res.status(500).json({ message: 'Server error updating request status.', error: error.message });
  }
};

// Schedule Session (Mentor only)
const scheduleRequest = async (req, res) => {
  try {
    const { sessionDate, sessionTime, meetingPlatform, meetingLink } = req.body;
    const requestId = req.params.id;
    const mentorId = req.user.id;

    const finalLink = meetingLink || req.body.googleMeetLink;
    const finalPlatform = meetingPlatform || 'Google Meet';

    if (!sessionDate || !sessionTime || !finalLink) {
      return res.status(400).json({ 
        message: 'Session date, time, and meeting link are required to schedule.' 
      });
    }

    const request = await Request.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found.' });
    }

    // Check authorization
    if (request.mentorId.toString() !== mentorId) {
      return res.status(403).json({ message: 'Access denied. Only the assigned mentor can schedule this session.' });
    }

    // Transition Validation: Must be Accepted or already Scheduled (for updates/rescheduling)
    const currentStatus = request.status;
    if (currentStatus !== 'Accepted' && currentStatus !== 'Scheduled') {
      return res.status(400).json({ 
        message: `Cannot schedule session unless the request status is "Accepted". Current status: "${currentStatus}".` 
      });
    }

    // Update session info and status to Scheduled
    request.sessionDate = sessionDate;
    request.sessionTime = sessionTime;
    request.meetingPlatform = finalPlatform;
    request.meetingLink = finalLink;
    request.googleMeetLink = finalLink; // backward compatibility
    request.status = 'Scheduled';

    await request.save();

    res.status(200).json({
      message: 'Session scheduled successfully.',
      request,
    });
  } catch (error) {
    console.error('ScheduleRequest Error:', error);
    res.status(500).json({ message: 'Server error scheduling session.', error: error.message });
  }
};

module.exports = {
  createRequest,
  getRequests,
  updateRequestStatus,
  scheduleRequest,
};
