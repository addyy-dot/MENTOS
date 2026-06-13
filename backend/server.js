const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { seedAdmin } = require('./seeders/adminSeeder');

// Load env variables
dotenv.config();

// Connect to Database
connectDB().then(() => {
  // Seed default admin account
  seedAdmin();
});

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/mentors', require('./routes/mentorRoutes'));
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Health Check API
app.get('/', (req, res) => {
  res.json({ status: 'healthy', message: 'MentorBridge API is running.' });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'An unexpected server error occurred.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
