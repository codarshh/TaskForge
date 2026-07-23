import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskforge', {
      serverSelectionTimeoutMS: 8000 // Allow more time for MongoDB Atlas cloud connection
    });
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    global.isMockDB = false;
  } catch (error) {
    console.warn(`\n======================================================`);
    console.warn(`[MongoDB] Connection failed: ${error.message}`);
    console.warn(`[MongoDB] Falling back to simulated JSON File Database (mock_db.json)`);
    console.warn(`======================================================\n`);
    global.isMockDB = true;
  }
};
