import prisma from './prisma';

export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log('Prisma connected to SQLite database successfully.');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
};
