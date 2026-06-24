import axios from 'axios';

// Base Axios instance pointing to Spring Boot backend
const isProd = import.meta.env.PROD;
const api = axios.create({
  baseURL: isProd ? 'https://violet-tactile-fructose.ngrok-free.dev' : window.location.origin,
  headers: { 
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true' // Bypasses Ngrok warning page for API calls
  },
});

// ── Request Interceptor ──────────────────────────────────────────────────────
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
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const requestUrl = error.config?.url || '';
    
    // MOCK DATA FALLBACK FOR VERCEL (Serverless Mode)
    // If the backend is not running, intercept the 404/Network Error and return static JSON
    if (!requestUrl.includes('/api/auth/')) {
      try {
        if (requestUrl.includes('/electronics/categories') || requestUrl.includes('/fashion/categories')) {
          const res = await axios.get('/mock-categories.json');
          return { data: res.data };
        }
        if (requestUrl.includes('/electronics')) {
          const res = await axios.get('/mock-electronics.json');
          const parts = requestUrl.split('?')[0].split('/');
          const idStr = parts[parts.length - 1];
          if (idStr !== 'electronics' && idStr !== 'products') {
            const product = res.data.find(p => String(p.id) === idStr || String(p.mongoID) === idStr);
            if (product) return { data: product };
          }
          return { data: res.data };
        }
        if (requestUrl.includes('/fashion')) {
          const res = await axios.get('/mock-fashion.json');
          const parts = requestUrl.split('?')[0].split('/');
          const idStr = parts[parts.length - 1];
          if (idStr !== 'fashion' && idStr !== 'products') {
            const product = res.data.find(p => String(p.id) === idStr || String(p.mongoID) === idStr);
            if (product) return { data: product };
          }
          return { data: res.data };
        }
      } catch (mockError) {
        console.error("Mock fallback failed", mockError);
      }
    }

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
