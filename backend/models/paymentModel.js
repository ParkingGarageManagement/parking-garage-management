import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
  },
  amount: {
    type: Number,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  provider: {
    // optional provider identifier (e.g., gpay, phonepe, paytm, razorpay)
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'cash'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  transactionId: {
    type: String,
    unique: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Payment', paymentSchema);