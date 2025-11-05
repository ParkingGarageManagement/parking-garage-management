import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getHistory } from '../controllers/historyController.js';

const router = express.Router();

// Public endpoint to get parking history (exited vehicles)
router.get('/', getHistory);

export default router;
