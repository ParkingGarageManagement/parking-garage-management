import mongoose from 'mongoose';

const slotSchema = new mongoose.Schema({
  slotNumber: {
    type: String,
    required: true,
    unique: true,
  },
  floor: {
    type: Number,
    required: true,
  },
  isOccupied: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['standard', 'handicap', 'electric'],
    default: 'standard',
  },
  currentVehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    default: null,
  },
  hourlyRate: {
    type: Number,
    required: true,
    default: 100.00, // Default rate in INR
  },
}, {
  timestamps: true,
});

export default mongoose.model('Slot', slotSchema);