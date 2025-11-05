import mongoose from 'mongoose';
import Slot from './models/slotModel.js';

const seedSlots = async () => {
  try {
    // First check if we already have slots
    const existingSlots = await Slot.countDocuments();
    if (existingSlots > 0) {
      console.log('Slots already seeded');
      return;
    }

    // Create 15 slots across 3 floors with different rates
    const slots = [];
    const floors = [1, 2, 3];
    const sections = ['A', 'B', 'C', 'D', 'E'];

    floors.forEach(floor => {
      sections.forEach((section, idx) => {
        slots.push({
          slotNumber: `${section}${floor}`,
          floor,
          type: 'car',
          hourlyRate: 50 - ((floor - 1) * 10), // 50/40/30 based on floor
          position: [
            28.6139 + (idx * 0.001), // slight offset for map view
            77.2090 + (floor * 0.001)
          ]
        });
      });
    });

    await Slot.insertMany(slots);
    console.log('Default slots created');
  } catch (error) {
    console.error('Error seeding slots:', error);
  }
};

export default seedSlots;