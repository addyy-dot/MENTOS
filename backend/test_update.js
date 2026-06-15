const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Request = require('./models/request');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const request = await Request.findById('6a2f79eb76e43627281ea772');
    if (!request) {
      console.log('Request not found');
      return;
    }

    console.log('Current status:', request.status);
    request.status = 'Accepted';
    await request.save();
    console.log('Updated status successfully to:', request.status);

    // Reset it back to Pending for the user to verify in frontend
    request.status = 'Pending';
    await request.save();
    console.log('Reset status back to Pending');

    await mongoose.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('Error during update test:', error);
  }
};

run();
