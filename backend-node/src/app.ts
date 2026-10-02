import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';

// Routers
import authRoutes from './routes/authRoutes';
import plantRoutes from './routes/plantRoutes';
import visionRoutes from './routes/visionRoutes';
import sensorRoutes from './routes/sensorRoutes';
import fertilizerRoutes from './routes/fertilizerRoutes';
import deviceRoutes from './routes/deviceRoutes';

export const app = express();

// Middlewares
app.use(cors({ origin: [env.FRONTEND_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Images Static Folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health Check Root Endpoint
app.get('/', (_req, res) => {
  res.json({
    status: 'online',
    app: 'Plantora Node.js Express Backend API',
    aiProvider: 'Google Gemini 1.5 Flash Vision (ONLY AI Provider)',
    version: '1.0.0'
  });
});

// API Routes Registration
app.use('/api/auth', authRoutes);
app.use('/api', plantRoutes);
app.use('/api', visionRoutes);
app.use('/api', sensorRoutes);
app.use('/api', fertilizerRoutes);
app.use('/api', deviceRoutes);
