import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createPayment,
  getPaymentById,
  getPayments,
} from '../controllers/paymentController.js';

const router = express.Router();

router.route('/')
  .post(protect, createPayment)
  .get(protect, admin, getPayments);

router.route('/:id')
  .get(protect, getPaymentById);

export default router;