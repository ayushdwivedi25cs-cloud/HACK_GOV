import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import sosRoutes from './routes/sosRoutes';
import incidentRoutes from './routes/incidentRoutes';
import aiRoutes from './routes/aiRoutes';
import missingPersonRoutes from './routes/missingPersonRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Static directory for uploaded forensics/screenshot files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes mapping
app.use('/api/auth', authRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/missing-person', missingPersonRoutes);

// Server status indicator endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'AI Emergency Government Navigator API is active.',
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`[Server] Service running on port ${PORT}`);
});
export default app;
