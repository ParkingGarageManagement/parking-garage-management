import { useState, useEffect } from 'react';
import { slotAPI } from '../services/api';

export const useSlotStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    occupied: 0,
    available: 0,
    floorStats: {} // Stats per floor
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateStats = (slots) => {
    if (!Array.isArray(slots)) return;
    
    const floorStats = {};
    slots.forEach(slot => {
      // Initialize floor stats if not exists
      if (!floorStats[slot.floor]) {
        floorStats[slot.floor] = {
          total: 0,
          occupied: 0,
          available: 0
        };
      }
      
      // Update floor stats
      floorStats[slot.floor].total++;
      if (slot.isOccupied) {
        floorStats[slot.floor].occupied++;
      } else {
        floorStats[slot.floor].available++;
      }
    });

    // Calculate total stats
    const total = slots.length;
    const occupied = slots.filter(s => s.isOccupied).length;
    
    setStats({
      total,
      occupied,
      available: total - occupied,
      floorStats
    });
  };

  const fetchAndUpdateStats = async () => {
    try {
      setLoading(true);
      const response = await slotAPI.getSlots();
      const slots = response.data || response;
      if (Array.isArray(slots)) {
        calculateStats(slots);
        setError(null);
      } else {
        throw new Error('Invalid slot data received');
      }
    } catch (err) {
      console.error('Error fetching slot stats:', err);
      setError('Failed to load parking statistics');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and setup polling
  useEffect(() => {
    fetchAndUpdateStats();
    const interval = setInterval(fetchAndUpdateStats, 3000); // Update every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchAndUpdateStats
  };
};