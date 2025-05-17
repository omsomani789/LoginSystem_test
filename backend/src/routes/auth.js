import express from 'express';
import { signup, login } from '../controllers/authController.js';
import { loginLimiter } from '../config/security.js';

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', loginLimiter, login);

export default router; 