import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/vehicleModel.js';
import Slot from '../models/slotModel.js';

dotenv.config({ path: './.env' });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    // Delete vehicles that are parked but missing slot or missing user (stale seed data)
    const stale = await Vehicle.find({ status: 'parked', $or: [{ user: null }, { slot: null }] });
    console.log(`Found ${stale.length} stale parked vehicles`);
    for (const v of stale) {
      await Vehicle.deleteOne({ _id: v._id });
      console.log(`Deleted stale vehicle: ${v.licensePlate} (${v._id})`);
    }
  } catch (err) {
    console.error('Error clearing stale vehicles:', err);
  } finally {
    process.exit(0);
  }
};

run();
