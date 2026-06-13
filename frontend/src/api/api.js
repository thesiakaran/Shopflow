import axios from 'axios';

// Base Axios instance pointing to Spring Boot backend
const api = axios.create({
  baseURL: window.location.origin,
  headers: { 'Content-Type': 'application/json' },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attaches JWT token to every request if user is logged in
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ─────────────────────────────────────────────────────
// If 401 (token expired/invalid) → clear storage and redirect to login
// But skip for /api/auth/* endpoints — those 401s are expected business logic
// (e.g. wrong password), not expired tokens.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url || '';
    const isAuthEndpoint = requestUrl.includes('/api/auth/');
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
