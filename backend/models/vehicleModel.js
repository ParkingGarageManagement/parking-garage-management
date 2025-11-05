import mongoose from 'mongoose';

const vehicleSchema = mongoose.Schema(
  {
    licensePlate: { type: String, required: true },
    // reference the Slot document so we can populate slot details (slotNumber, hourlyRate)
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    duration: { type: Number, default: 0 },
    status: { type: String, default: 'parked' }, // parked / exited / pending
    // store computed total fee on exit
    totalFee: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional
    entryTime: { type: Date, default: Date.now },
    exitTime: { type: Date },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
