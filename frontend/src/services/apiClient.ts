/// <reference types="vite/client" />
import axios from 'axios';

// The backend team will provide this URL via environment variables.
// During development, it falls back to the current render API or a local instance.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://subsidy-backend-4jzy.onrender.com/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor (e.g., for attaching auth tokens)
apiClient.interceptors.request.use(
  (config) => {
    // In a real app, you would fetch the token from localStorage or a state management library
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (e.g., for global error handling like 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Global error handling can go here
    if (error.response?.status === 401) {
      console.warn('Unauthorized request - redirecting to login');
      // e.g., window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


