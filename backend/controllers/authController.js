const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user (mentee or mentor)
const register = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      password, 
      role, 
      branch, 
      year, 
      bio, 
      skills, 
      targetCompanies, 
      availability, 
      companiesCracked, 
      expertise,
      currentCompany,
      currentRole,
      linkedinProfile,
      targetSkills,
      collegeName,
      targetRole
    } = req.body;

    // Validation
    if (!fullName || !email || !password || !role) {
      return res.status(400).json({ message: 'Full name, email, password, and role are required.' });
    }

    if (role !== 'mentor' && role !== 'mentee') {
      return res.status(400).json({ message: 'Role must be either mentor or mentee. Admin accounts cannot be created via registration.' });
    }

    if (role === 'mentor') {
      if (!currentCompany || !currentRole || !linkedinProfile) {
        return res.status(400).json({ message: 'Current company, job role, and LinkedIn profile URL are required for mentors.' });
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Prepare profile info depending on role
    const newUser = new User({
      fullName,
      email,
      passwordHash,
      role,
      branch: branch || '',
      year: role === 'mentee' ? (year || '') : '', // Year only relevant for mentees
      bio: bio || '',
      skills: Array.isArray(skills) ? skills : [],
      targetCompanies: role === 'mentee' && Array.isArray(targetCompanies) ? targetCompanies : [],
      targetSkills: role === 'mentee' && Array.isArray(targetSkills) ? targetSkills : [],
      collegeName: collegeName || '',
      targetRole: role === 'mentee' && Array.isArray(targetRole) ? targetRole : [],
      availability: role === 'mentor' ? (availability || '') : '',
      currentCompany: role === 'mentor' ? (currentCompany || '') : '',
      currentRole: role === 'mentor' ? (currentRole || '') : '',
      linkedinProfile: role === 'mentor' ? (linkedinProfile || '') : '',
      isVerified: false,
      verificationStatus: role === 'mentor' ? 'pending' : undefined,
      companiesCracked: role === 'mentor' && Array.isArray(companiesCracked) ? companiesCracked : [],
      expertise: role === 'mentor' && Array.isArray(expertise) ? expertise : [],
      rating: 0,
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    // Do not return passwordHash
    const userResponse = newUser.toObject();
    delete userResponse.passwordHash;

    res.status(201).json({
      message: 'User registered successfully.',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    const userResponse = user.toObject();
    delete userResponse.passwordHash;

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

// Get current user details
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({ message: 'Server error fetching user profile.', error: error.message });
  }
};

// Edit Profile
const editProfile = async (req, res) => {
  try {
    const { 
      fullName, 
      bio, 
      branch, 
      year, 
      skills, 
      targetCompanies, 
      availability, 
      currentCompany,
      currentRole,
      companiesCracked,
      expertise,
      linkedinProfile,
      profilePicture,
      targetSkills,
      collegeName,
      targetRole
    } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Common fields
    if (fullName) user.fullName = fullName;
    if (bio !== undefined) user.bio = bio;
    if (branch !== undefined) user.branch = branch;
    if (skills !== undefined) user.skills = Array.isArray(skills) ? skills : [];
    if (profilePicture !== undefined) user.profilePicture = profilePicture;
    if (collegeName !== undefined) user.collegeName = collegeName;

    // Role-specific fields
    if (user.role === 'mentee') {
      if (year !== undefined) user.year = year;
      if (targetCompanies !== undefined) user.targetCompanies = Array.isArray(targetCompanies) ? targetCompanies : [];
      if (targetSkills !== undefined) user.targetSkills = Array.isArray(targetSkills) ? targetSkills : [];
      if (targetRole !== undefined) user.targetRole = Array.isArray(targetRole) ? targetRole : [];
    } else if (user.role === 'mentor') {
      if (availability !== undefined) user.availability = availability;
      if (currentCompany !== undefined) user.currentCompany = currentCompany;
      if (currentRole !== undefined) user.currentRole = currentRole;
      if (companiesCracked !== undefined) user.companiesCracked = Array.isArray(companiesCracked) ? companiesCracked : [];
      if (expertise !== undefined) user.expertise = Array.isArray(expertise) ? expertise : [];
      if (linkedinProfile !== undefined) user.linkedinProfile = linkedinProfile;
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.passwordHash;

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Edit Profile Error:', error);
    res.status(500).json({ message: 'Server error updating profile.', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  editProfile,
};
