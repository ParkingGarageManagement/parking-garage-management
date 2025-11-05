import axios from 'axios';

// Use relative path for API calls
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (name, email, password) => {
    const response = await api.post('/users', { name, email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
};

// Vehicle API calls
export const vehicleAPI = {
  addVehicle: async (data) => {
    const response = await api.post('/vehicles', data);
    return response.data;
  },
  exitVehicle: async (id) => {
    const response = await api.put(`/vehicles/${id}/exit`);
    return response.data;
  },
  getVehicles: async () => {
    const response = await api.get('/vehicles');
    return response.data;
  },
  getVehicleById: async (id) => {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  },
};

// Slot API calls
export const slotAPI = {
  getSlots: async () => {
    const response = await api.get('/slots');
    return response.data;
  },
  getSlotById: async (id) => {
    const response = await api.get(`/slots/${id}`);
    return response.data;
  },
};

// Payment API calls
export const paymentAPI = {
  createPayment: async (data) => {
    const response = await api.post('/payments', data);
    return response.data;
  },
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },
};

// History API
export const historyAPI = {
  getHistory: async () => {
    const response = await api.get('/history');
    return response.data;
  },
};

// Feedback API
export const feedbackAPI = {
  submitFeedback: async (payload) => {
    const response = await api.post('/feedback', payload);
    return response.data;
  },
  getFeedbacks: async () => {
    const response = await api.get('/feedback');
    return response.data;
  },
};

export default api;