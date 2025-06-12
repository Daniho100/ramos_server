import express from 'express';
import serverless from 'serverless-http';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from '../src/routes/authRoutes.js';
import listingRoutes from '../src/routes/listingRoutes.js';
import errorHandler from '../src/middlewares/errMid.js';
import connectDB from '../src/config/db.js';

dotenv.config();

// Connect to MongoDB (lazy-init)
let dbConnection = null;
const initDB = async () => {
  if (!dbConnection) {
    try {
      dbConnection = await connectDB(process.env.MONGODB_URL);
      console.log('✅ MongoDB connected');
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err.message);
    }
  }
};

// Create Express app
const app = express();

// CORS & Security
app.use(cors({
  origin: 'https://ramos-client.vercel.app',
  credentials: true,
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://ramos-client.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Routes
app.use('/api/listings', listingRoutes);
app.use('/api/auth', authRoutes);
app.use(errorHandler);

// 404 fallback
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Final Vercel handler
const handler = async (req, res) => {
  await initDB();
  return serverless(app)(req, res);
};

export default handler;
