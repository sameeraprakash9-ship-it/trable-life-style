import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';

const app = express();
const port = Number(process.env.PORT) || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

app.use((request, response) => {
  response.status(404).json({ message: `Route not found: ${request.method} ${request.path}` });
});

app.use((error, _request, response, _next) => {
  console.error(error);
  response.status(500).json({ message: 'Internal server error' });
});

const start = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is required');
  }

  await mongoose.connect(process.env.MONGO_URI);
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
};

start().catch((error) => {
  console.error('Unable to start API:', error.message);
  process.exitCode = 1;
});
