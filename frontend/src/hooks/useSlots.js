import { useState, useEffect } from 'react';
import { slotAPI } from '../services/api';

export const useSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSlots = async () => {
    try {
      const response = await slotAPI.getSlots();
      const slotsData = response.data || response;
      setSlots(Array.isArray(slotsData) ? slotsData : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching slots:', err);
      setError('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  // Poll for updates every 5 seconds
  useEffect(() => {
    fetchSlots();
    const interval = setInterval(fetchSlots, 5000);
    return () => clearInterval(interval);
  }, []);

  return {
    slots,
    loading,
    error,
    refreshSlots: fetchSlots
  };
};