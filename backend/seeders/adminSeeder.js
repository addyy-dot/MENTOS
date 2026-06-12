const User = require('../models/user');
const bcrypt = require('bcryptjs');

// Seed default admin account
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // Validate environment variables
    if (!adminEmail || !adminPassword) {
      console.log('⚠️  Admin credentials not found in .env. Skipping admin seeding.');
      return;
    }

    // Check if account with email exists
    let existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      // If user exists but is not admin, upgrade to admin
      if (existingUser.role !== 'admin') {
        // Hash new admin password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        // Update user to admin role with new password
        await User.findByIdAndUpdate(existingUser._id, {
          role: 'admin',
          passwordHash: hashedPassword,
          fullName: 'Administrator',
          bio: 'MentorBridge Admin Account',
        });
        console.log(`✅ Upgraded existing user ${adminEmail} to admin role.`);
      } else {
        console.log(`✅ Admin account already exists: ${adminEmail}`);
      }
      return;
    }

    // Hash admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create admin user
    const admin = new User({
      fullName: 'Administrator',
      email: adminEmail,
      passwordHash: hashedPassword,
      role: 'admin',
      bio: 'MentorBridge Admin Account',
    });

    await admin.save();
    console.log(`✅ Admin account created successfully: ${adminEmail}`);
  } catch (error) {
    console.error('❌ Error seeding admin account:', error.message);
  }
};

module.exports = { seedAdmin };
