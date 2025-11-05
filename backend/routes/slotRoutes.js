import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  getSlots,
  getSlotById,
  createSlot,
  updateSlot,
  getAvailableSlots,
  reserveSlot,
} from '../controllers/slotController.js';

const router = express.Router();

router.route('/')
  .get(getSlots)
  .post(protect, admin, createSlot);

router.route('/available')
  .get(getAvailableSlots);

router.route('/:id')
  .get(getSlotById)
  .put(protect, admin, updateSlot);

router.route('/:id/reserve')
  .post(protect, reserveSlot);

export default router;