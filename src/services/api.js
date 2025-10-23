import axios from 'axios';

// Create axios instance with base URL
// We're assuming the API is running at http://localhost:8080/api based on requirements
// If the actual API URL is different, update this value
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  // Adding longer timeout for debugging
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include JWT in Authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle unauthorized errors (401) by redirecting to login
    if (error.response && error.response.status === 401) {
      // Clear token from localStorage
      localStorage.removeItem('jwt');
      // Redirect to login page if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;