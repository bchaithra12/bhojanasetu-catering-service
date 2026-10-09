import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const getApiErrorMessage = (error, fallbackMessage) => {
  if (error.response?.status === 401) {
    return 'Your login token is missing, expired, or no longer valid. Sign out and sign in again, then reload orders.';
  }

  const responseMessage = error.response?.data?.message;
  if (typeof responseMessage === 'string' && responseMessage.trim()) {
    return responseMessage;
  }

  if (!error.response && error.request) {
    return 'Cannot reach the server. Check that the API is running and try again.';
  }

  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }

  return fallbackMessage;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

const inFlightGetRequests = new Map();

const getOnce = (url, config) => {
  const requestKey = api.getUri({ ...config, url });
  const existingRequest = inFlightGetRequests.get(requestKey);
  if (existingRequest) return existingRequest;

  const request = api.get(url, config).then(
    (response) => {
      inFlightGetRequests.delete(requestKey);
      return response;
    },
    (error) => {
      inFlightGetRequests.delete(requestKey);
      throw error;
    }
  );

  inFlightGetRequests.set(requestKey, request);
  return request;
};

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API calls
export const authAPI = {
  register: (name, email, password, confirmPassword) =>
    api.post('/auth/register', { name, email, password, confirmPassword }),
  login: (email, password) =>
    api.post('/auth/login', { email, password }),
  getProfile: () =>
    getOnce('/auth/profile'),
  updateProfile: (data) =>
    api.put('/auth/profile', data),
  changePassword: (data) =>
    api.put('/auth/password', data)
};

// User Management API calls (Admin only)
export const userAPI = {
  getAllUsers: () =>
    getOnce('/users'),
  getUserById: (id) =>
    getOnce(`/users/${id}`),
  updateUser: (id, data) =>
    api.put(`/users/${id}`, data),
  deleteUser: (id) =>
    api.delete(`/users/${id}`)
};

// Catering Service API calls
export const categoryAPI = {
  // Categories
  getAll: () => getOnce('/categories'),
  getActive: () => getOnce('/categories/active'),
  getById: (id) => getOnce(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),

  // Dishes
  getAllDishes: () => getOnce('/dishes'),
  getAvailableDishes: () => getOnce('/dishes/available'),
  getDishesByCategory: (category) => getOnce(`/dishes/category/${category}`),
  getDishById: (id) => getOnce(`/dishes/${id}`),
  createDish: (data) => api.post('/dishes', data),
  updateDish: (id, data) => api.put(`/dishes/${id}`, data),
  deleteDish: (id) => api.delete(`/dishes/${id}`),

  // Orders
  createOrder: (data) => api.post('/orders', data),
  getAllOrders: () => getOnce('/orders'),
  getOrderById: (id) => getOnce(`/orders/${id}`),
  getOrdersByEmail: (email) => getOnce(`/orders/email/${email}`),
  updateOrderStatus: (id, status) => api.patch(`/orders/${id}/status`, { orderStatus: status }),
  cancelOrder: (id) => api.patch(`/orders/${id}/cancel`)
};

export default api;
