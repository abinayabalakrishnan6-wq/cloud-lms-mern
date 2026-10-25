const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && (uri.startsWith('mongodb+srv://') || !uri.includes('127.0.0.1') && !uri.includes('localhost'))) {
      // Direct remote MongoDB Atlas connection
      console.log('🔗 Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
      return;
    }

    // Try local / specified URI
    try {
      console.log(`🔗 Attempting MongoDB connection: ${uri || 'default local'}...`);
      const conn = await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/lms_cloud_db', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (localErr) {
      console.log('⚠️ Local MongoDB not detected. Starting in-memory MongoDB fallback engine...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const memUri = mongodInstance.getUri();
        const conn = await mongoose.connect(memUri);
        console.log(`✅ In-Memory MongoDB Server running for rapid testing: ${conn.connection.host}`);
        return;
      } catch (memErr) {
        console.error('❌ Could not start MongoDB fallback:', memErr.message);
        throw localErr;
      }
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
