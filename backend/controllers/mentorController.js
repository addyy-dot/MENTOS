const User = require('../models/user');

// Get all mentors with search and filter capabilities
const getMentors = async (req, res) => {
  try {
    const { search, skill, company, expertise, verifiedOnly, currentRole } = req.query;
    
    // Base query only fetches mentors
    let query = { role: 'mentor' };
    let conditions = [];

    // Filter by verification status if requested
    if (verifiedOnly === 'true') {
      query.isVerified = true;
    }

    // Apply search filter (name, bio, branch)
    if (search) {
      conditions.push({
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { bio: { $regex: search, $options: 'i' } },
          { branch: { $regex: search, $options: 'i' } },
        ]
      });
    }

    // Filter by specific skill
    if (skill) {
      const skillQueries = skill.split(',').map(s => s.trim()).filter(Boolean);
      if (skillQueries.length > 0) {
        conditions.push({
          skills: { 
            $in: skillQueries.map(s => new RegExp(s, 'i')) 
          }
        });
      }
    }

    // Filter by company (either cracked or currently working at)
    if (company) {
      conditions.push({
        $or: [
          { companiesCracked: { $regex: company, $options: 'i' } },
          { currentCompany: { $regex: company, $options: 'i' } }
        ]
      });
    }

    // Filter by job role / designation
    if (currentRole) {
      conditions.push({
        currentRole: { $regex: currentRole, $options: 'i' }
      });
    }

    // Filter by expertise area (domain)
    if (expertise) {
      conditions.push({
        expertise: { $regex: expertise, $options: 'i' }
      });
    }

    if (conditions.length > 0) {
      query.$and = conditions;
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
