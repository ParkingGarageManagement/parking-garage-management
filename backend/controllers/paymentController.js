import asyncHandler from 'express-async-handler';
import Payment from '../models/paymentModel.js';
import Vehicle from '../models/vehicleModel.js';

// @desc    Create new payment
// @route   POST /api/payments
// @access  Private
export const createPayment = asyncHandler(async (req, res) => {
  const { vehicleId, amount, paymentMethod } = req.body;

  let vehicle = null;
  if (vehicleId) {
    vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      res.status(404);
      throw new Error('Vehicle not found');
    }
  }

  // Generate a unique transaction ID
  const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9);

  // If amount not provided, use vehicle.totalFee
  const paymentAmount = amount || vehicle.totalFee || 0;

  const payment = await Payment.create({
    vehicle: vehicle ? vehicle._id : null,
    amount: paymentAmount,
    user: req.user._id,
    paymentMethod,
    transactionId,
    status: 'pending',
  });

  // Simulate payment processing and mark completed
  payment.status = 'completed';
  await payment.save();

  // If payment is for a vehicle, link payment to vehicle and mark vehicle as paid
  if (vehicle) {
    vehicle.paid = true;
    // Ensure vehicle.totalFee is set
    if (!vehicle.totalFee || vehicle.totalFee === 0) vehicle.totalFee = paymentAmount;
    await vehicle.save();
  }

  res.status(201).json({
    message: 'Payment processed successfully',
    data: payment,
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
export const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('vehicle', 'licensePlate')
    .populate('user', 'name email');

  if (payment) {
    res.json(payment);
  } else {
    res.status(404);
    throw new Error('Payment not found');
  }
});

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
export const getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({})
    .populate('vehicle', 'licensePlate')
    .populate('user', 'name email');
  res.json(payments);
});