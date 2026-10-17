import axios from 'axios';

// Get base URL from environment or default to your deployed Vercel backend API
let rawBaseURL = import.meta.env.VITE_API_BASE_URL || 'https://jobportal-backend-api.vercel.app/api';
rawBaseURL = rawBaseURL.replace(/\/+$/, '');
const baseURL = rawBaseURL.endsWith('/api') ? rawBaseURL : `${rawBaseURL}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically attach JWT token from localStorage
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

// Response interceptor: handle 401 unauthorized gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token is invalid or expired, clear local storage
      const currentPath = window.location.pathname;
      if (
        currentPath !== '/login' &&
        currentPath !== '/register' &&
        localStorage.getItem('token')
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
