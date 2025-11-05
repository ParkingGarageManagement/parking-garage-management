// backend/controllers/vehicleController.js
import asyncHandler from 'express-async-handler';
import Vehicle from '../models/vehicleModel.js';
import Slot from '../models/slotModel.js';

// @desc   Create a new vehicle record
// @route  POST /api/vehicles
// @access Public (change to Private if authentication added)
export const createVehicle = asyncHandler(async (req, res) => {
  try {
    const { licensePlate, slot, duration } = req.body;
    console.log('Creating vehicle with data:', { licensePlate, slot, duration });
    console.log('User from request:', req.user);

    if (!licensePlate) {
      res.status(400);
      throw new Error('License plate is required');
    }

    if (!slot) {
      res.status(400);
      throw new Error('Slot is required');
    }

    // Check if vehicle is already parked in any slot (populate slot for helpful message)
    const parkedVehicle = await Vehicle.findOne({
      licensePlate,
      status: 'parked'
    }).populate('slot', 'slotNumber');

    if (parkedVehicle) {
      const slotNum = parkedVehicle.slot?.slotNumber || parkedVehicle.slot || 'unknown';
      res.status(400);
      throw new Error(`Vehicle with license plate ${licensePlate} is already parked in slot ${slotNum}`);
    }

    // Check if the selected slot exists and is available
    const slotDoc = await Slot.findById(slot);
    if (!slotDoc) {
      res.status(400);
      throw new Error('Selected slot not found');
    }
    if (slotDoc.isOccupied) {
      res.status(400);
      throw new Error(`Slot ${slotDoc.slotNumber} is already occupied`);
    }

    const vehicle = new Vehicle({
      licensePlate,
      slot: slotDoc._id,
      duration: duration || 1,
      status: 'parked',
      totalFee: 0,
      user: req.user?._id
    });

    const created = await vehicle.save();

    // Mark slot as occupied
    slotDoc.isOccupied = true;
    slotDoc.currentVehicle = created._id;
    await slotDoc.save();

    console.log('Vehicle created successfully:', created);
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating vehicle:', error);
    res.status(400);
    throw error;
  }
});

// @desc   Get all vehicles
// @route  GET /api/vehicles
// @access Private
export const getVehicles = asyncHandler(async (req, res) => {
  try {
    // Base query - only show currently parked vehicles by default
    let query = { status: 'parked' };

    // If not admin, only show user's vehicles
    if (!req.user.isAdmin) {
      query.user = req.user._id;
    }

    console.log('Fetching vehicles with query:', query);
    
    const vehicles = await Vehicle.find(query)
      .populate('user', 'name email')
      .populate('slot', 'slotNumber floor hourlyRate type')
      .sort('-createdAt'); // Show newest first
    
    console.log('Found vehicles:', vehicles.length);

    // Compute a realtime/current fee for parked vehicles (do not persist)
    const vehiclesWithFees = vehicles.map(v => {
      const obj = v.toObject ? v.toObject() : v;
      try {
        if (obj.status === 'parked' && obj.slot && obj.entryTime) {
          const exitTime = Date.now();
          const entryTime = obj.entryTime || obj.createdAt;
          const hours = Math.max(1, Math.ceil((exitTime - new Date(entryTime)) / (1000 * 60 * 60)));
          const rate = obj.slot.hourlyRate || 0;
          obj.currentFee = rate * hours;
          obj.currentDuration = hours;
        }
      } catch (e) {
        // ignore compute errors and leave fields undefined
        console.error('Error computing current fee for vehicle', obj._id, e);
      }
      return obj;
    });

    res.json(vehiclesWithFees);
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500);
    throw error;
  }
});

// @desc   Get vehicle by ID
// @route  GET /api/vehicles/:id
// @access Private
export const getVehicleById = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id)
    .populate('user', 'name email')
    .populate('slot', 'slotNumber floor hourlyRate type');
  
  if (vehicle) {
    const obj = vehicle.toObject ? vehicle.toObject() : vehicle;
    try {
      if (obj.status === 'parked' && obj.slot && obj.entryTime) {
        const exitTime = Date.now();
        const entryTime = obj.entryTime || obj.createdAt;
        const hours = Math.max(1, Math.ceil((exitTime - new Date(entryTime)) / (1000 * 60 * 60)));
        const rate = obj.slot.hourlyRate || 0;
        obj.currentFee = rate * hours;
        obj.currentDuration = hours;
      }
    } catch (e) {
      console.error('Error computing current fee for vehicle', obj._id, e);
    }
    res.json(obj);
  } else {
    res.status(404);
    throw new Error('Vehicle not found');
  }
});

// @desc   Update vehicle status on exit
// @route  PUT /api/vehicles/:id/exit
// @access Private
export const exitVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('slot');

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  // Compute exit time and fee
  const exitTime = Date.now();
  const entryTime = vehicle.entryTime || vehicle.createdAt;
  const hours = Math.max(1, Math.ceil((exitTime - new Date(entryTime)) / (1000 * 60 * 60)));
  const rate = vehicle.slot?.hourlyRate || 0;
  const totalFee = rate * hours;

  vehicle.status = 'exited';
  vehicle.exitTime = exitTime;
  vehicle.totalFee = totalFee;
  vehicle.duration = hours;

  const updatedVehicle = await vehicle.save();

  // Free up the slot if linked
  if (vehicle.slot) {
    const slotDoc = await Slot.findById(vehicle.slot._id || vehicle.slot);
    if (slotDoc) {
      slotDoc.isOccupied = false;
      slotDoc.currentVehicle = null;
      await slotDoc.save();
    }
  }

  res.json(updatedVehicle);
});

// @desc   Delete a vehicle
// @route  DELETE /api/vehicles/:id
// @access Private/Admin
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    res.status(404);
    throw new Error('Vehicle not found');
  }

  await vehicle.deleteOne();
  res.json({ message: 'Vehicle removed successfully' });
});
