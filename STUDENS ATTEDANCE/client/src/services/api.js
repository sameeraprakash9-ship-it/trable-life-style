import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
};

export const studentsApi = {
  list: (params) => api.get('/students', { params }),
  create: (payload) => api.post('/students', payload),
  update: (id, payload) => api.patch(`/students/${id}`, payload),
  remove: (id) => api.delete(`/students/${id}`),
};

export const attendanceApi = {
  list: (date) => api.get('/attendance', { params: { date } }),
  save: (payload) => api.put('/attendance', payload),
};

export default api;
