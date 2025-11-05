import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, vehicleAPI, paymentAPI, historyAPI, feedbackAPI, slotAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const userData = await authAPI.getProfile();
      setUser(userData);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  // NEW: add vehicle helper
  const addVehicle = async (payload) => {
    try {
      // normalize payload: accept slotId or slot
      const body = {
        licensePlate: payload.licensePlate,
        vehicleType: payload.vehicleType,
        slot: payload.slot || payload.slotId || payload.slot_id,
      };
      const data = await vehicleAPI.addVehicle(body);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Add vehicle failed' };
    }
  };

  // NEW: exit vehicle helper
  const exitVehicle = async (vehicleId) => {
    try {
      const data = await vehicleAPI.exitVehicle(vehicleId);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Exit vehicle failed' };
    }
  };

  // NEW: make payment helper
  const makePayment = async (payload) => {
    try {
      const data = await paymentAPI.createPayment(payload);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Payment failed' };
    }
  };

  // NEW: fetch history
  const fetchHistory = async () => {
    try {
      const data = await historyAPI.getHistory();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Fetch history failed' };
    }
  };

  // NEW: submit feedback
  const submitFeedback = async (payload) => {
    try {
      const data = await feedbackAPI.submitFeedback(payload);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || 'Submit feedback failed' };
    }
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
      if (data && data.token) {
        localStorage.setItem('token', data.token);
        setUser(data);
        return { success: true };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Login failed',
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const data = await authAPI.register(name, email, password);
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        addVehicle,
        exitVehicle,
        makePayment,
        fetchHistory,
        submitFeedback,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};