import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import listingRoutes from './routes/listingRoutes.js';
import errorHandler from './middlewares/errMid.js';
import connectDB from './config/db.js';

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

const allowedOrigins = ['https://ramos-client.onrender.com'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  })
);

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

// Initialize MongoDB and start server
const startServer = async () => {
  await initDB();
  const PORT = process.env.PORT || 10000; // Use Render's port or default
  app.listen(PORT, '0.0.0.0', () => { // Bind to 0.0.0.0
    console.log(`✅ Server running on port ${PORT}`);
  });
};

startServer().catch(err => console.error('❌ Server failed to start:', err));