import mongoose from 'mongoose';
import Slot from '../models/slotModel.js';

// Seed initial parking slots
export const seedSlots = async () => {
  try {
    // Remove existing slots first
    await Slot.deleteMany({});
    console.log('Cleared existing slots');

    // Configuration
    const TOTAL_SLOTS = 30;
    const FLOORS = [1, 2, 3];
    const SLOTS_PER_FLOOR = 10;

    const slots = [];

    console.log(`Creating ${TOTAL_SLOTS} parking slots...`);

    FLOORS.forEach(floor => {
      for (let i = 1; i <= SLOTS_PER_FLOOR; i++) {
        const slotNumber = `${floor}${i.toString().padStart(2, '0')}`; // e.g. 101, 102, etc.

        // Assign slot type based on position
        let type;
        if (i <= 7) type = 'standard';
        else if (i <= 9) type = 'handicap';
        else type = 'electric';

        const hourlyRate =
          type === 'standard' ? 100 :
          type === 'handicap' ? 80 :
          150;

        slots.push({
          slotNumber,
          floor,
          type,
          hourlyRate,
          isOccupied: false,
          currentVehicle: null,
        });

        console.log(`Slot created: ${slotNumber} (${type})`);
      }
    });

    // Insert into DB
    const createdSlots = await Slot.insertMany(slots);
    console.log(` Successfully created ${createdSlots.length} parking slots`);

    // Verify
    const slotCount = await Slot.countDocuments();
    console.log(`Total slots now in DB: ${slotCount}`);

    return createdSlots;
  } catch (error) {
    console.error(' Error seeding slots:', error);
    throw error;
  }
};

// Initialize all seed data
export const initializeSeeds = async () => {
  try {
    await seedSlots();
  } catch (error) {
    console.error('Error initializing seeds:', error);
  }
};
