const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  menteeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mentee ID is required'],
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Mentor ID is required'],
  },
  requestMessage: {
    type: String,
    required: [true, 'Request message is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Accepted', 'Scheduled', 'Completed', 'Rejected'],
      message: '{VALUE} is not a valid status',
    },
    default: 'Pending',
  },
  sessionDate: {
    type: String, // format: YYYY-MM-DD
    default: '',
  },
  sessionTime: {
    type: String, // format: HH:MM (24-hour)
    default: '',
  },
  googleMeetLink: {
    type: String,
    default: '',
  },
  meetingPlatform: {
    type: String,
    enum: {
      values: ['Google Meet', 'Microsoft Teams', 'Zoom', 'Discord', 'Other'],
      message: '{VALUE} is not a valid meeting platform',
    },
    default: 'Google Meet',
  },
  meetingLink: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Request', requestSchema);
