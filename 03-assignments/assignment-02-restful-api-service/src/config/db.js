const mongoose = require('mongoose');

async function connectDB() {
  const url = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/libraryLendingDB';
  try {
    await mongoose.connect(url);
    console.log(`MongoDB connected: ${mongoose.connection.name}`);
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
