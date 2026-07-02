import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hackgov';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully to:', mongoUri);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};
