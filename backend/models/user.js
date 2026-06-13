const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  passwordHash: {
    type: String,
    required: [true, 'Password hash is required'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['mentor', 'mentee', 'admin'],
      message: '{VALUE} is not a valid role',
    },
  },
  branch: {
    type: String,
    default: '',
  },
  year: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  targetCompanies: {
    type: [String],
    default: [],
  },
  availability: {
    type: String, // e.g. "Mon-Wed: 6pm-8pm, Sat: 10am-2pm"
    default: '',
  },
  currentCompany: {
    type: String,
    default: '',
  },
  currentRole: {
    type: String,
    default: '',
  },
  companiesCracked: {
    type: [String], // for mentors
    default: [],
  },
  expertise: {
    type: [String], // for mentors
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  linkedinProfile: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  profilePicture: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
