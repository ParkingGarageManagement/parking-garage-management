import asyncHandler from 'express-async-handler';
import Vehicle from '../models/vehicleModel.js';

// NEW: return exited vehicles (history)
export const getHistory = asyncHandler(async (req, res) => {
  const history = await Vehicle.find({ status: 'exited' })
    .populate('user', 'name email')
    .populate('slot', 'slotNumber floor hourlyRate')
    .sort({ exitTime: -1 });
  res.json({ data: history });
});
