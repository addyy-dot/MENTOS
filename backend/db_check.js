const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./models/user');
const Request = require('./models/request');

const checkDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const users = await User.find({}, 'fullName email role');
    console.log('\n--- USERS ---');
    console.log(JSON.stringify(users, null, 2));

    const requests = await Request.find({});
    console.log('\n--- REQUESTS ---');
    console.log(JSON.stringify(requests, null, 2));

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error running check:', error);
  }
};

checkDB();
