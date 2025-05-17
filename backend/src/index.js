import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import { apiLimiter } from './config/security.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 