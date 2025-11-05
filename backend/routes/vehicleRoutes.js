import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import {
  createVehicle,
  exitVehicle,
  getVehicles,
  getVehicleById,
} from '../controllers/vehicleController.js';

const router = express.Router();

router.route('/')
  .post(protect, createVehicle)
  .get(protect, getVehicles);

router.route('/:id')
  .get(protect, getVehicleById);

router.route('/:id/exit')
  .put(protect, exitVehicle);

export default router;