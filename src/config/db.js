// import { MongoClient } from 'mongodb';

// let client;

// const connectDB = async (url) => {
//   if (!client) {
//     try {
//       client = new MongoClient(url, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//       });
//       await client.connect();
//       console.log('MongoDB connected');
//     } catch (err) {
//       console.error('MongoDB connection error:', err);
//       throw err;
//     }
//   }
//   return client.db(); // Return the database instance
// };

// export default connectDB;








import mongoose from 'mongoose';

const connectDB = async (mongoUri) => {
  try {
    const conn = await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 5000, // Faster failure detection
    heartbeatFrequencyMS: 10000,    // Check connection every 10s
    maxPoolSize: 10,               // Limit connection pool size
    autoIndex: false,              // Disable auto-indexing in production
    retryWrites: true,             // Enable retry on write failures
  });
  return conn;
  } catch (error) {
    console.log(error);
  }
  
};

export default connectDB;