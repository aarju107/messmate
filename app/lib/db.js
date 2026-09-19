import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

console.log('🔍 Checking MONGODB_URI:', MONGODB_URI ? '✅ Found' : '❌ NOT FOUND');

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
  console.log('📦 Creating new cache');
}

async function connectDB() {
  console.log('🔗 connectDB() called');
  
  if (cached.conn) {
    console.log('✅ Using cached connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🚀 Creating new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log('✅ Connected to MongoDB successfully!');
      return mongoose;
    }).catch((error) => {
      console.error('❌ MongoDB connection failed:', error.message);
      throw error;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;