// import app from './app.js'
// import dotenv from 'dotenv'
// import connectDB from'./config/db.js'

// dotenv.config();

// const PORT = process.env.PORT || process.env.PORT2 || 5000;
// const MONGODB_URL = process.env.MONGODB_URL;

// const startServer = () => {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// };

// connectDB(MONGODB_URL)
//   .then(() => {
//     console.log('Database connected, starting server...');
//     startServer();
//   })
//   .catch((err) => {
//     console.error('Failed to connect to database:', err.message || err);
//     process.exit(1);
//   });




import app from './app.js'; // Same directory
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Adjust path based on config location

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;

// Singleton for MongoDB connection
let dbConnection = null;

const initializeDB = async () => {
  if (!dbConnection) {
    try {
      dbConnection = await connectDB(MONGODB_URL);
      console.log('Database connected');
    } catch (err) {
      console.error('Failed to connect to database:', err.message || err);
    }
  }
  return dbConnection;
};

// Initialize DB on first request
initializeDB();

export default app;