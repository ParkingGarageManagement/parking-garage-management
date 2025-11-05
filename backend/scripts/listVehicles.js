import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/vehicleModel.js';
import Slot from '../models/slotModel.js';

dotenv.config({ path: './.env' });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    const vehicles = await Vehicle.find({}).populate('slot', 'slotNumber floor hourlyRate').populate('user', 'name email');
    console.log(`Found ${vehicles.length} vehicles:`);
    vehicles.forEach(v => {
      console.log({
        _id: v._id.toString(),
        licensePlate: v.licensePlate,
        status: v.status,
        slot: v.slot ? v.slot.slotNumber : v.slot,
        user: v.user ? `${v.user.name} <${v.user.email}>` : null,
        entryTime: v.entryTime,
        exitTime: v.exitTime,
        totalFee: v.totalFee,
      });
    });
  } catch (err) {
    console.error('Error listing vehicles:', err);
  } finally {
    process.exit(0);
  }
};

run();
