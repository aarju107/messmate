import mongoose from 'mongoose';

let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in .env.local');
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).catch((error) => {
      cached.promise = null; // allow retry on next request
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
