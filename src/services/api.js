import axios from 'axios';

// Use ngrok URL to ensure same backend as mobile app
const API_URL = 'https://testing-backend-akshaya.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true', // Skip ngrok warning page
  },
});

// Legacy Menu API (kept for backward compatibility)
export const menuAPI = {
  getAllItems: async () => {
    const response = await api.get('/menu');
    return response.data;
  },
  getItemsByDay: async (day) => {
    const response = await api.get(`/menu/day/${day}`);
    return response.data;
  },
  getItemById: async (id) => {
    const response = await api.get(`/menu/${id}`);
    return response.data;
  },
  createItem: async (itemData) => {
    const response = await api.post('/menu', itemData);
    return response.data;
  },
  updateItem: async (id, itemData) => {
    const response = await api.put(`/menu/${id}`, itemData);
    return response.data;
  },
  deleteItem: async (id) => {
    const response = await api.delete(`/menu/${id}`);
    return response.data;
  },
};

// ============================================
// NEW ADMIN PANEL APIs
// ============================================

// Package Meals API
export const packagesAPI = {
  getAll: async () => {
    const response = await api.get('/packages');
    return response.data;
  },
  getByDay: async (day, mealType = null) => {
    const url = mealType ? `/packages/day/${day}?mealType=${mealType}` : `/packages/day/${day}`;
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/packages/${id}`);
    return response.data;
  },
  create: async (packageData) => {
    const response = await api.post('/packages', packageData);
    return response.data;
  },
  update: async (id, packageData) => {
    const response = await api.put(`/packages/${id}`, packageData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/packages/${id}`);
    return response.data;
  },
};

// Single Meals API
export const singlesAPI = {
  getAll: async (includeHidden = true) => {
    const response = await api.get(`/singles?includeHidden=${includeHidden}`);
    return response.data;
  },
  getCategories: async () => {
    const response = await api.get('/singles/categories');
    return response.data;
  },
  getByCategory: async (category, includeHidden = true) => {
    const response = await api.get(`/singles/category/${encodeURIComponent(category)}?includeHidden=${includeHidden}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/singles/${id}`);
    return response.data;
  },
  create: async (itemData) => {
    const response = await api.post('/singles', itemData);
    return response.data;
  },
  update: async (id, itemData) => {
    const response = await api.put(`/singles/${id}`, itemData);
    return response.data;
  },
  toggleVisibility: async (id, isVisible) => {
    const response = await api.patch(`/singles/${id}/visibility`, { isVisible });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/singles/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  getAll: async (status = null) => {
    const url = status ? `/orders?status=${status}` : '/orders';
    const response = await api.get(url);
    return response.data;
  },
  getByStatus: async (status) => {
    const response = await api.get(`/orders/status/${status}`);
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/orders/stats');
    return response.data;
  },
  create: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },
  updateStatus: async (id, status) => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
  assignRider: async (id, riderId, riderName) => {
    const response = await api.patch(`/orders/${id}/assign`, { riderId, riderName });
    return response.data;
  },
};

// Riders API
export const ridersAPI = {
  getAll: async (status = null) => {
    const url = status ? `/riders?status=${status}` : '/riders';
    const response = await api.get(url);
    return response.data;
  },
  getAvailable: async () => {
    const response = await api.get('/riders/available');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/riders/${id}`);
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/riders/stats');
    return response.data;
  },
  create: async (riderData) => {
    const response = await api.post('/riders', riderData);
    return response.data;
  },
  update: async (id, riderData) => {
    const response = await api.put(`/riders/${id}`, riderData);
    return response.data;
  },
  updateStatus: async (id, status, currentOrderId = null) => {
    const response = await api.patch(`/riders/${id}/status`, { status, currentOrderId });
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/riders/${id}`);
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },
  getByPhone: async (phone) => {
    const response = await api.get(`/users/${phone}`);
    return response.data;
  },
  updateStatus: async (phone, isActive) => {
    const response = await api.patch(`/users/${phone}/status`, { isActive });
    return response.data;
  },
};

export default api;