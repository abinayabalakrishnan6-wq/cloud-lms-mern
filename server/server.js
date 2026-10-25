const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const User = require('./models/User');
const populateSeedData = require('./seed/seedData');

// Import routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Cloud-Based LMS REST API',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/admin', adminRoutes);

// In production, serve the built React frontend
if (process.env.NODE_ENV === 'production') {
  const clientDist = path.join(__dirname, '../client/dist');
  app.use(express.static(clientDist));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientDist, 'index.html'));
  });
} else {
  // Error handling for dev mode
  app.use(notFound);
  app.use(errorHandler);
}

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, auto-seed if empty, and start server
const startServer = async () => {
  await connectDB();

  // Auto-populate seed data if database is brand new/empty
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Fresh database detected. Initializing with sample demo data...');
      await populateSeedData();
    }
  } catch (err) {
    console.error('Error checking initial database state:', err.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 LMS Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📡 API Health Check: http://localhost:${PORT}/api/health`);
    if (process.env.NODE_ENV === 'production') {
      console.log(`🌐 Web App Live: http://localhost:${PORT}`);
    }
  });
};

startServer();
