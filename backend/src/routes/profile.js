import express from 'express';
import { viewProfile, updateProfile, updatePassword } from '../controllers/profileController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply auth middleware to all profile routes
router.use(authMiddleware);

// Profile routes
router.get('/', viewProfile);
router.put('/', updateProfile);
router.put('/password', updatePassword);

export default router; 