import serverless from 'serverless-http';
import app from '../app.js';
import dotenv from 'dotenv';
import connectDB from '../config/db.js'; 

dotenv.config();

let dbConnection = null;

const initializeDB = async () => {
  if (!dbConnection) {
    try {
      dbConnection = await connectDB(process.env.MONGODB_URL);
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err.message || err);
    }
  }
};

// Wrap app in handler
const handler = async (req, res) => {
  await initializeDB(); // Ensure DB is ready before handling the request
  return serverless(app)(req, res);
};

export default handler;
