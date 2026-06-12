const User = require('../models/user');

// Get all mentors with search and filter capabilities
const getMentors = async (req, res) => {
  try {
    const { search, skill, company, expertise } = req.query;
    
    // Base query only fetches mentors
    let query = { role: 'mentor' };

    // Apply search filter (name, bio, branch)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
        { branch: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by specific skill
    if (skill) {
      query.skills = { $regex: skill, $options: 'i' };
    }

    // Filter by company cracked
    if (company) {
      query.companiesCracked = { $regex: company, $options: 'i' };
    }

    // Filter by expertise area
    if (expertise) {
      query.expertise = { $regex: expertise, $options: 'i' };
    }

    const mentors = await User.find(query).select('-passwordHash');
    res.status(200).json({ mentors });
  } catch (error) {
    console.error('GetMentors Error:', error);
    res.status(500).json({ message: 'Server error retrieving mentors list.', error: error.message });
  }
};

// Get a single mentor profile by ID
const getMentorById = async (req, res) => {
  try {
    const mentor = await User.findOne({ _id: req.params.id, role: 'mentor' }).select('-passwordHash');
    if (!mentor) {
      return res.status(404).json({ message: 'Mentor not found.' });
    }
    res.status(200).json({ mentor });
  } catch (error) {
    console.error('GetMentorById Error:', error);
    res.status(500).json({ message: 'Server error retrieving mentor profile.', error: error.message });
  }
};

module.exports = {
  getMentors,
  getMentorById,
};
