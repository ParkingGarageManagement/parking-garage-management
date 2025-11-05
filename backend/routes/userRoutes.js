import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

export default router;