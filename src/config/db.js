import mongoose from 'mongoose';

async function connectDB(mongoUri) {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

export default connectDB;