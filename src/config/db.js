import { MongoClient } from 'mongodb';

let client;

const connectDB = async (url) => {
  if (!client) {
    try {
      client = new MongoClient(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      await client.connect();
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      throw err;
    }
  }
  return client.db(); // Return the database instance
};

export default connectDB;