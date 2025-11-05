import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Slot from '../models/slotModel.js';

dotenv.config({ path: './.env' });

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const s = await Slot.findOne({ slotNumber: '101' });
    console.log('slot 101', s);
  } catch (e) { console.error(e); } finally { process.exit(0); }
};

run();
