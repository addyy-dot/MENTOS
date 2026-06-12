const User = require('../models/user');
const Request = require('../models/request');

// Get admin dashboard statistics
const getStats = async (req, res) => {
  try {
    // Count all users by role
    const totalUsers = await User.countDocuments();
    const totalMentors = await User.countDocuments({ role: 'mentor' });
    const totalMentees = await User.countDocuments({ role: 'mentee' });

    // Count requests by status
    const totalRequests = await Request.countDocuments();
    const pendingRequests = await Request.countDocuments({ status: 'Pending' });
    const acceptedRequests = await Request.countDocuments({ status: 'Accepted' });
    const scheduledRequests = await Request.countDocuments({ status: 'Scheduled' });
    const completedRequests = await Request.countDocuments({ status: 'Completed' });
    const rejectedRequests = await Request.countDocuments({ status: 'Rejected' });

    res.json({
      totalUsers,
      totalMentors,
      totalMentees,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      scheduledRequests,
      completedRequests,
      rejectedRequests,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Error fetching statistics.', error: error.message });
  }
};

// Get all users with optional search filter
const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    // Search by name or email if search query provided
    if (search) {
      filter = {
        $or: [
          { fullName: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // Find users excluding passwordHash and exclude admin from list
    const users = await User.find(filter)
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json({
      count: users.length,
      users,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.', error: error.message });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id; // From JWT token

    // Admin cannot delete own account
    if (id === adminId) {
      return res.status(400).json({ message: 'Admin cannot delete their own account.' });
    }

    // Find and delete user
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Delete all associated requests (both as mentee and mentor)
    await Request.deleteMany({
      $or: [{ menteeId: id }, { mentorId: id }],
    });

    res.json({
      message: `User ${user.email} and associated requests deleted successfully.`,
      deletedUser: user.email,
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user.', error: error.message });
  }
};

module.exports = {
  getStats,
  getUsers,
  deleteUser,
};
