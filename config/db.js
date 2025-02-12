
const mongoose = require('mongoose');
require('dotenv').config(); 

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI; 
  if (!mongoURI) {
    throw new Error('MONGO_URI is not defined in the environment.');
  }
  try {
    await mongoose.connect(mongoURI )
        .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
