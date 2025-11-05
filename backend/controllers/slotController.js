import asyncHandler from 'express-async-handler';
import Slot from '../models/slotModel.js';

// @desc    Get all slots
// @route   GET /api/slots
// @access  Public
export const getSlots = asyncHandler(async (req, res) => {
  try {
    const slots = await Slot.find({})
      .populate('currentVehicle', 'licensePlate')
      .sort({ floor: 1, slotNumber: 1 });
    
    if (!slots || slots.length === 0) {
      try {
        console.log('No slots found, initializing parking slots...');
        const { seedSlots } = await import('../utils/seeder.js');
        await seedSlots();
        
        // Try fetching again
        const newSlots = await Slot.find({})
          .populate('currentVehicle', 'licensePlate')
          .sort({ floor: 1, slotNumber: 1 });

        if (!newSlots || newSlots.length === 0) {
          throw new Error('Failed to create parking slots');
        }

        console.log(`Successfully initialized ${newSlots.length} parking slots`);
        return res.json(newSlots);
      } catch (seedError) {
        console.error('Error seeding slots:', seedError);
        throw new Error(`Failed to initialize parking slots: ${seedError.message}`);
      }
    }
    
    console.log(`Found ${slots.length} existing parking slots`);
    res.json(slots);
  } catch (error) {
    console.error('Error fetching slots:', error);
    res.status(500).json({ 
      message: 'Failed to fetch parking slots',
      error: error.message 
    });
  }
});

// @desc    Get slot by ID
// @route   GET /api/slots/:id
// @access  Public
export const getSlotById = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id)
    .populate('currentVehicle', 'licensePlate vehicleType owner');

  if (slot) {
    res.json(slot);
  } else {
    res.status(404);
    throw new Error('Slot not found');
  }
});

// @desc    Create new slot
// @route   POST /api/slots
// @access  Private/Admin
export const createSlot = asyncHandler(async (req, res) => {
  const { slotNumber, floor, type, hourlyRate } = req.body;

  const slotExists = await Slot.findOne({ slotNumber });
  if (slotExists) {
    res.status(400);
    throw new Error('Slot already exists');
  }

  const slot = await Slot.create({
    slotNumber,
    floor,
    type,
    hourlyRate,
  });

  res.status(201).json(slot);
});

// @desc    Update slot
// @route   PUT /api/slots/:id
// @access  Private/Admin
export const updateSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id);

  if (slot) {
    slot.slotNumber = req.body.slotNumber || slot.slotNumber;
    slot.floor = req.body.floor || slot.floor;
    slot.type = req.body.type || slot.type;
    slot.hourlyRate = req.body.hourlyRate || slot.hourlyRate;
    
    // Handle vehicle assignment/removal
    if (req.body.currentVehicle !== undefined) {
      slot.currentVehicle = req.body.currentVehicle;
      slot.isOccupied = !!req.body.currentVehicle;
    }

    const updatedSlot = await slot.save();
    res.json(updatedSlot);
  } else {
    res.status(404);
    throw new Error('Slot not found');
  }
});

// @desc    Get available slots
// @route   GET /api/slots/available
// @access  Public
export const getAvailableSlots = asyncHandler(async (req, res) => {
  const { type, floor } = req.query;
  
  let query = { isOccupied: false };
  if (type) query.type = type;
  if (floor) query.floor = floor;
  
  const slots = await Slot.find(query)
    .select('slotNumber floor type hourlyRate')
    .sort({ floor: 1, slotNumber: 1 });
  
  res.json(slots);
});

// @desc    Reserve a slot
// @route   POST /api/slots/:id/reserve
// @access  Private
export const reserveSlot = asyncHandler(async (req, res) => {
  const slot = await Slot.findById(req.params.id);
  
  if (!slot) {
    res.status(404);
    throw new Error('Slot not found');
  }
  
  if (slot.isOccupied) {
    res.status(400);
    throw new Error('Slot is already occupied');
  }
  
  slot.isOccupied = true;
  slot.currentVehicle = req.body.vehicleId;
  
  const updatedSlot = await slot.save();
  res.json(updatedSlot);
});