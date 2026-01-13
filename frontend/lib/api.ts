import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Content Generation API
export const generateAPI = {
  generateContent: async (prompt: string, contentType: 'blog' | 'product' | 'caption') => {
    const response = await api.post('/generate-content', { prompt, contentType });
    return response.data;
  },
  getStatus: async (jobId: string) => {
    const response = await api.get(`/job/${jobId}/status`);
    return response.data;
  },
};

// Content Management API
export const contentAPI = {
  getAll: async (searchQuery?: string) => {
    const params = searchQuery ? { search: searchQuery } : {};
    const response = await api.get('/content', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },
  update: async (id: string, data: { title?: string; generatedText?: string }) => {
    const response = await api.put(`/content/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/content/${id}`);
    return response.data;
  },
};

export default api;

